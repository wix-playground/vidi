import {getNativeEventsHandlers} from './events';
import {PlaybackState, defaultPlaybackState, PlaybackStatus, MediaSource, MediaStreamTypes, MediaStream, PlayableStream, PlayableStreamCreator, EventListener, EventListenerMap, MediaStreamDeliveryType} from './types';
import {HlsStream, DashStream, nativeStreamFactory, resolvePlayableStreams, detectStreamType} from './media-streams';
import {NativeEnvironmentSupport, isString} from './utils';

/**
 * The default `vidi` main application class.
 * 
 * It holds the core logic that intends to simplify playback loading decisions by:
 * - Allow specification of several sources. Prioritizing adaptive sources.
 * - Checking formats support in the current playback environment
 * 
 * The following stream formats are supported:
 * 1. Native HLS
 * 2. HLS via MSE (hls.js)
 * 3. MPEG-DASH via MSE (dash.js)
 * 4. Native MP4
 * 5. Native WebM
 * 
 * The minimal requirements for working playback are:
 * 1. an `HTMLVideoElement`, which can be provided during construction, or later by calling [[setVideoElement]].
 * 2. a `MediaSource`, which can be set via the [[src]] setter.
 */
export class Vidi {
    /**
     * Static built-in enum for playback status values.
     */
    public static PlaybackStatus = PlaybackStatus;
    /**
     * Static built-in string identifiers for known stream formats.
     */
    public static MediaStreamTypes = MediaStreamTypes;

    /**
     * Event handling
     */
    private nativeEventHandlers = getNativeEventsHandlers(this);
    private eventListeners: EventListenerMap = Object.create(null);


    private streamCreators: PlayableStreamCreator[] = [];
    private videoElement: HTMLVideoElement = null; // The current HTMLVideoElement
    private currentSrc: MediaSource | MediaSource[] = null;

    private playableStreams: PlayableStream[] = null;
    private connectedStream: PlayableStream = null;

    /**
     * The main entry point to using Vidi.
     * 
     * @param nativeVideoEl is an optional paramaters and is a shorthand for:
     * ```ts
     * const vidi = new Vidi();
     * vidi.setVideoElement(nativeVideoEl);
     * ```
     */
    constructor(nativeVideoEl: HTMLVideoElement = null) {
        this.onNativeEvent = this.onNativeEvent.bind(this);

        const streamCreators: PlayableStreamCreator[] = [
            nativeStreamFactory(MediaStreamTypes.HLS, MediaStreamDeliveryType.NATIVE_ADAPTIVE), // Native HLS (Safari, Edge)
            HlsStream, // Hls via hls.js (Chrome, Firefox, IE11, Opera?)
            DashStream, // MPEG-DASH via dash.js (Chrome, Firefox, IE11, Safari, Edge)
            nativeStreamFactory(MediaStreamTypes.MP4, MediaStreamDeliveryType.NATIVE_PROGRESSIVE), // Native MP4 (Chrome, Firefox, IE11, Safari, Edge)
            nativeStreamFactory(MediaStreamTypes.WEBM, MediaStreamDeliveryType.NATIVE_PROGRESSIVE) // Native WebM (Chrome, Firefox)
        ];

        // Only add supported handlers 
        streamCreators.forEach(streamCreator => streamCreator.isSupported(NativeEnvironmentSupport) && this.streamCreators.push(streamCreator));

        this.setVideoElement(nativeVideoEl);
    }

    /**
     * Sets a new `src` for playback.
     * If a `<video>` element is already attached, this will initiate loading of the new `src` into it.
     * 
     * @param src The new [[MediaSource]].
     * 
     */
    set src(src: MediaSource | MediaSource[]) {
        if (src === this.currentSrc) {
            return;
        }

        this.detachCurrentStream();

        this.currentSrc = src;

        this.resolvePlayableStreams();
        this.connectStreamToVideo();
    }

    /**
     * Getter for the src.
     * 
     * @returns The currently set [[MediaSource]] on this vidi instance.
     */
    get src(): MediaSource | MediaSource[] {
        return this.currentSrc;
    }

    /**
     * Attaches to a new `<video>` element.
     * If a previous element was set, `vidi` will detach from it.
     * If a `src` is already set, this will initiate loading it into the new element. 
     * 
     * @param nativeVideoEl The new `<video>` element to attach to.
     */
    public setVideoElement(nativeVideoEl: HTMLVideoElement) {
        if (this.videoElement === nativeVideoEl) {
            return;
        }

        this.removeNativeVideoListeners(this.videoElement);
        this.detachCurrentStream();

        this.videoElement = nativeVideoEl;
        this.addNativeVideoListeners(this.videoElement);
        this.connectStreamToVideo();
    }

    /**
     * @returns The currently attached `<video>` element.
     */
    public getVideoElement(): HTMLVideoElement {
        return this.videoElement;
    }

    /**
     * @returns If a `<video>` element is attached, it returns the current [[PlaybackState]] as an object.
     * 
     * Otherwise, it returns [[defaultPlaybackState]].
     * 
     * 
     */
    public getPlaybackState(): PlaybackState {
        if (!this.videoElement) {
            return defaultPlaybackState;
        }

        const playbackState: PlaybackState = {
            currentTime: this.videoElement.currentTime,
            duration: this.videoElement.duration || 0,
            muted: this.videoElement.muted,
            playbackRate: this.videoElement.playbackRate,
            status: this.videoElement.paused ? PlaybackStatus.PAUSED : PlaybackStatus.PLAYING,
            volume: this.videoElement.volume
        };

        return playbackState;
    }

    /**
     * Same as calling the native `play()` method on the attached `<video>` node,
     * but also handles exceptions and Promise rejections (depending on the browser),
     * and exposes them via the `error` event.
     * 
     * *Does nothing when no `<video>` is attached.*
     */
    public play() {
        if (!this.videoElement) {
            return;
        }

        try {
            const res: any = this.videoElement.play();
            if (res && res.catch) {
                res.catch(e => this.handleNativeError(e));
            }
        } catch (e) {
            this.handleNativeError(e);
        }
    }

    /**
     * Same as calling the native `pause()` method on the attached `<video>` node,
     * but also handles exceptions and Promise rejections (depending on the browser),
     * and exposes them via the `error` event.
     * 
     * *Does nothing when no `<video>` is attached.*
     */
    public pause() {
        if (!this.videoElement) {
            return;
        }

        try {
            const res: any = this.videoElement.pause();
            if (res && res.catch) {
                res.catch(e => this.handleNativeError(e));
            }
        } catch (e) {
            this.handleNativeError(e);
        }
    }

    /**
     * @returns An array of currently registered [[MediaStreamHandler]]s.
     */
    public getStreamHandlers(): PlayableStreamCreator[] {
        return this.streamCreators;
    }

    /**
     * Add a listener to a specific event.
     * 
     * @param eventType The event type for which the `callback` should be called.
     * @param callback The function to call once the event is emitted.
     */
    public on(eventType: string, callback: Function) {
        this.addEventListenerToMap(eventType, callback);
    }

    /**
     * Add a one-time listener to a specific event.
     * It will be automatically removed after the event type is emitted and `callback` is called.
     * 
     * @param eventType The event type for which the `callback` should be called.
     * @param callback The function to call once the event is emitted.
     */
    public once(eventType: string, callback: Function) {
        this.addEventListenerToMap(eventType, callback, true);
    }


    /**
     * Remove a listener to a specific event.
     * 
     * @param eventType The event type for which the `callback` was added.
     * @param callback The callback function to remove.
     */
    public off(eventType: string, callback: Function) {
        if (!eventType || !callback) {
            return;
        }

        const currentListeners = this.eventListeners[eventType];
        if (currentListeners !== undefined) {
            this.eventListeners[eventType] = currentListeners.filter(listener => listener.callback !== callback)
        }
    }

    /**
     * Trigger a new event.
     * Calls every listener that was added for the provided event type
     * with `data` passed as the first parameter.
     * 
     * @param eventType The event type to emit/trigger.
     * @param data An optional data parameter to pass as first parameter to the callback.
     */
    public emit(eventType: string, ...args) {
        if (!eventType) {
            return;
        }

        const removeAfterEmit: EventListener[] = [];

        const currentListeners = this.eventListeners[eventType];
        if (!currentListeners) {
            return;
        }

        currentListeners.forEach(listener => {
            listener.callback.call(this, ...args);
            if (listener.once) {
                removeAfterEmit.push(listener)
            }
        });

        if (removeAfterEmit.length) {
            this.eventListeners[eventType] = currentListeners.filter(listener => removeAfterEmit.indexOf(listener) === -1);
        }
    }

    /**
     * 
     */
    public setMediaLevel(index: number) {
        if (this.connectedStream) {
            this.connectedStream.setMediaLevel(index, this.videoElement);
        }
    }

    // Private helpers

    private autoDetectSourceTypes(mediaSources: MediaSource[]): MediaStream[] {
        return mediaSources.map(mediaSource => {
            if (isString(mediaSource)) {
                const url = mediaSource as string;
                return { url, type: detectStreamType(url) };
            } else {
                return mediaSource as MediaStream;
            }
        });
    }

    private resolvePlayableStreams() {
        if (!this.currentSrc) {
            this.playableStreams = [];
            return;
        }
        const mediaSources: MediaSource[] = [].concat(this.currentSrc);
        const mediaStreams = this.autoDetectSourceTypes(mediaSources);
        this.playableStreams = resolvePlayableStreams(mediaStreams, this.streamCreators, this.emit.bind(this));
    }

    private connectStreamToVideo() {
        if (!this.playableStreams || !this.videoElement) {
            return;
        }

        if (this.playableStreams.length > 0) {
            // Use the first MediaStream for now
            // Later, we can use the others as fallback
            this.connectedStream = this.playableStreams[0];
            this.connectedStream.attach(this.videoElement);
        }
    }

    private detachCurrentStream() {
        if (this.connectedStream) {
            this.connectedStream.detach(this.videoElement);
            this.connectedStream = null;
        }
    }

    private addNativeVideoListeners(videoElement) {
        if (!videoElement) {
            return;
        }

        Object.keys(this.nativeEventHandlers).forEach(e => videoElement.addEventListener(e, this.onNativeEvent));
    }

    private removeNativeVideoListeners(videoElement) {
        if (!videoElement) {
            return;
        }

        Object.keys(this.nativeEventHandlers).forEach(e => videoElement.removeEventListener(e, this.onNativeEvent));
    }

    private onNativeEvent(event: Event) {
        if (event.target !== this.videoElement) {
            return;
        }
        const handler = this.nativeEventHandlers[event.type];
        if (handler) {
            handler();
        } else {
            throw `Received a native event without an handler: ${event.type}`;
        }
    }

    private handleNativeError(error) {
        this.emit('error', error);
    }

    private addEventListenerToMap(eventType: string, callback: Function, once: boolean = false) {
        if (!eventType || !callback) {
            return;
        }
        const toAdd = { once, callback };

        const currentListeners = this.eventListeners[eventType];
        if (currentListeners === undefined) {
            this.eventListeners[eventType] = [toAdd]
        } else {
            currentListeners.push(toAdd)
        }
    }
}
