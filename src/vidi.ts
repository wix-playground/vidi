import {getNativeEventsHandlers} from './events';
import {PlaybackState, defaultPlaybackState, PlaybackStatus, MediaSource, MediaSourceHandler, MediaStreamTypes, MediaStream, MediaStreamHandler, EventListener, EventListenerMap} from './types';
import {MediaStreamSourceHandler, URLSourceHandler} from './source-handlers';
import {HlsStreamHandler, DashStreamHandler, NativeStreamHandler/*, ShakaStreamHandler*/} from './stream-handlers';

/**
 * The default `vidi` main application class.
 * 
 * It holds the core logic that intends to simplify playback loading decisions by:
 * - Allowing custom sources that may specify several [[MediaStream]] objects that can be played.
 * - Checking formats support in the current playback environment.
 * - Picking the most-suitable [[MediaStream]] for the current `src` and environment.
 * 
 * By default, the following **stream** handlers are pre-registered:
 * 1. [[NativeStreamHandler]]([[MediaStreamTypes]].HLS)
 * 2. [[HlsStreamHandler]]
 * 3. [[DashStreamHandler]]
 * 4. [[NativeStreamHandler]]([[MediaStreamTypes]].MP4)
 * 5. [[NativeStreamHandler]]([[MediaStreamTypes]].WEBM)
 * 
 * And the following **source** handlers:
 * 1. [[URLSourceHandler]]
 * 2. [[MediaStreamSourceHandler]]
 * 
 * The minimal requirements for working playback are:
 * 1. an `HTMLVideoElement`, which can be provided during construction, or later by calling [[setVideoElement]].
 * 2. a `src`, which can be set via the [[src]] setter.
 */
export class Vidi {
    static PlaybackStatus = PlaybackStatus;

    /**
     * Static built-in string identifiers for known stream formats.
     */
    static MediaStreamTypes = MediaStreamTypes;

    private videoElement: HTMLVideoElement = null; // The current HTMLVideoElement
    private sourceHandlers: MediaSourceHandler[] = [];
    private streamHandlers: MediaStreamHandler[] = [];
    private currentSrc: MediaSource = null;
    private attachedStreamHandler: MediaStreamHandler = null;
    private nativeEventHandlers = getNativeEventsHandlers(this);
    private eventListeners: EventListenerMap = Object.create(null);

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
        this.sourceHandlers = [
            new MediaStreamSourceHandler,
            new URLSourceHandler
        ];

        const builtInStreamHandlers = [
            // new ShakaStreamHandler,
            new NativeStreamHandler(MediaStreamTypes.HLS),
            new HlsStreamHandler,
            new DashStreamHandler,
            new NativeStreamHandler(MediaStreamTypes.MP4),
            new NativeStreamHandler(MediaStreamTypes.WEBM)
        ];

        // Only add supported handlers 
        builtInStreamHandlers.forEach(handler => handler.isSupported() && this.streamHandlers.push(handler));

        this.setVideoElement(nativeVideoEl);
    }

    /**
     * Sets a new `src` for playback.
     * If a `<video>` element is already attached, this will initiate loading of the new `src` into it.
     * 
     * @param src The new [[MediaSource]].
     * 
     */
    set src(src: MediaSource) {
        if (src === this.currentSrc) {
            return;
        }
        this.detachCurrentStreamHandler();

        this.currentSrc = src;
        this.connectSourceToVideo();
    }

    /**
     * Getter for the src.
     * 
     * @returns The currently set [[MediaSource]] on this vidi instance.
     */
    get src(): MediaSource {
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

        this.removeVideoListeners(this.videoElement);
        this.detachCurrentStreamHandler();

        this.videoElement = nativeVideoEl;
        this.addVideoListeners(this.videoElement);
        this.connectSourceToVideo();
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
     * @returns An array of currently registered [[MediaSourceHandler]]s.
     */
    public getSourceHandlers(): MediaSourceHandler[] {
        return this.sourceHandlers;
    }

    /**
     * Register a new [[MediaSourceHandler]].
     * 
     * *Note: The handler is added to the beginning of the array, which gives it a higher priority.*
     * @param sourceHandler The [[MediaSourceHandler]] to add.
     */
    public registerSourceHandler(sourceHandler: MediaSourceHandler) {
        this.sourceHandlers.unshift(sourceHandler);
    }

    /**
     * @returns An array of currently registered [[MediaStreamHandler]]s.
     */
    public getStreamHandlers(): MediaStreamHandler[] {
        return this.streamHandlers;
    }

    /**
     * Register a new [[MediaStreamHandler]].
     * 
     * *Note: The handler is added to the beginning of the array, which gives it a higher priority.*
     * @param streamHandler The [[MediaStreamHandler]] to add.
     */
    public registerStreamHandler(streamHandler: MediaStreamHandler) {
        this.streamHandlers.unshift(streamHandler);
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
    public emit(eventType: string, data?: any) {
        if (!eventType) {
            return;
        }

        const removeAfterEmit: EventListener[] = [];

        const currentListeners = this.eventListeners[eventType];
        if (!currentListeners) {
            return;
        }

        currentListeners.forEach(listener => {
            listener.callback.call(this, data);
            if (listener.once) {
                removeAfterEmit.push(listener)
            }
        });

        if (removeAfterEmit.length) {
            this.eventListeners[eventType] = currentListeners.filter(listener => removeAfterEmit.indexOf(listener) === -1);
        }
    }

    // Private helpers

    private connectSourceToVideo() {
        if (!this.currentSrc || !this.videoElement) {
            return;
        }

        const compatibleSourceHandlers = this.getCompatibleSourceHandlers(this.currentSrc);
        if (!compatibleSourceHandlers.length) {
            throw new Error(`Vidi: couldn't find a compatible SourceHandler for src - ${this.currentSrc}`)
        }

        // We currently use the first compatible SourceHandler
        const mediaStreams = compatibleSourceHandlers[0].getMediaStreams(this.currentSrc);

        if (!mediaStreams.length) {
            throw new Error(`Vidi: compatible SourceHandler returned no MediaStreams for src - ${this.currentSrc}`)
        }

        // Use the first MediaStream for now
        const mediaStream = mediaStreams[0];

        const compatibleStreamHandlers = this.streamHandlers.filter(streamHandler => streamHandler.canHandleStream(mediaStream));
        if (!compatibleStreamHandlers.length) {
            throw new Error(`Vidi: couldn't find a compatible StreamHandler for ${MediaStreamTypes[mediaStream.type]} stream - ${mediaStream.url}`)
        }

        // For safety
        this.detachCurrentStreamHandler();

        // We currently use the first found source handler
        const streamHandler = compatibleStreamHandlers[0];
        streamHandler.attach(this.videoElement, mediaStream);
        this.attachedStreamHandler = streamHandler;
    }

    private detachCurrentStreamHandler() {
        if (this.attachedStreamHandler) {
            this.attachedStreamHandler.detach(this.videoElement);
            this.attachedStreamHandler = null;
        }
    }

    private addVideoListeners(videoElement) {
        if (!videoElement) {
            return;
        }

        Object.keys(this.nativeEventHandlers).forEach(e => videoElement.addEventListener(e, this.onNativeEvent));
    }

    private removeVideoListeners(videoElement) {
        if (!videoElement) {
            return;
        }

        Object.keys(this.nativeEventHandlers).forEach(e => videoElement.removeEventListener(e, this.onNativeEvent));
    }

    private onNativeEvent(event: Event) {
        if (event.target !== this.videoElement) {
            return;
        }
        // console.log('native event fired: '+event.type)
        const handler = this.nativeEventHandlers[event.type];
        if (handler) {
            handler();
        } else {
            throw `Received a native event without an handler: ${event.type}`;
        }
    }

    private getCompatibleSourceHandlers(src: MediaSource) {
        return this.sourceHandlers.filter(handler => handler.canHandleSource(src));
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
