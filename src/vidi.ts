import { getNativeEventsHandlers } from './events';
import {
    PlaybackState, defaultPlaybackState, PlaybackStatus, MediaSource, MediaStreamTypes,
    MediaStream, PlayableStream, PlayableStreamCreator, MediaStreamDeliveryType, Errors,
    VidiEmitter
} from './types';
import { HlsStream, DashStream, getNativeStreamCreator, resolvePlayableStreams, detectStreamType } from './media-streams';
import { NativeEnvironmentSupport } from './utils';

const DEFAULT_INITIAL_BITRATE = 1750; // 1750kbps, can be modified via Vidi.setInitialBitrate()

/**
 * The main `vidi` class.
 * 
 * Each instance manages playback for a single HTMLVideoElement, onto which sources can be loaded.
 */
export class Vidi extends VidiEmitter {
    public static PlaybackStatus = PlaybackStatus;
    public static MediaStreamTypes = MediaStreamTypes;
    public static Errors = Errors;

    private initialBitrate = DEFAULT_INITIAL_BITRATE;
    private nativeEventHandlers = getNativeEventsHandlers(this);
    private playableStreamCreators: PlayableStreamCreator[] = [];
    private videoElement: HTMLVideoElement | null = null;
    private currentSrc: MediaSource | MediaSource[] | null = null;

    private playableStreams: PlayableStream[] | null = null;
    private attachedStream: PlayableStream | null = null;

    /**
     * Constructor for creating Vidi instances
     * 
     * @param nativeVideoEl is an optional parameter and is a shorthand for:
     * ```ts
     * const vidi = new Vidi();
     * vidi.setVideoElement(nativeVideoEl);
     * ```
     */
    constructor(nativeVideoEl: HTMLVideoElement | null = null) {
        super();
        this.onNativeEvent = this.onNativeEvent.bind(this);

        const streamCreators: PlayableStreamCreator[] = [
            getNativeStreamCreator(MediaStreamTypes.HLS, MediaStreamDeliveryType.NATIVE_ADAPTIVE), // Native HLS (Safari, Edge)
            HlsStream, // Hls via hls.js (Chrome, Firefox, IE11, Opera?)
            DashStream, // MPEG-DASH via dash.js (Chrome, Firefox, IE11, Safari, Edge)
            getNativeStreamCreator(MediaStreamTypes.MP4, MediaStreamDeliveryType.NATIVE_PROGRESSIVE), // Native MP4 (Chrome, Firefox, IE11, Safari, Edge)
            getNativeStreamCreator(MediaStreamTypes.WEBM, MediaStreamDeliveryType.NATIVE_PROGRESSIVE) // Native WebM (Chrome, Firefox)
        ];

        // Only add supported handlers 
        streamCreators.forEach(streamCreator => streamCreator.isSupported(NativeEnvironmentSupport) && this.playableStreamCreators.push(streamCreator));

        this.setVideoElement(nativeVideoEl);
    }

    /**
     * Sets a new `src` for playback.
     * If a `<video>` element is already attached, this will initiate loading of the new `src` into it.
     * 
     * @param src The new [[MediaSource]].
     * 
     */
    set src(src: MediaSource | MediaSource[] | null) {
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
    get src(): MediaSource | MediaSource[] | null {
        return this.currentSrc;
    }

    /**
     * Attaches the `vidi` instance to a new `<video>` element.
     * If a previous element was set, `vidi` will detach from it.
     * If a `src` is already set, this will also trigger loading the `src` into the new element. 
     * 
     * @param nativeVideoEl The new `<video>` element to attach to.
     */
    public setVideoElement(nativeVideoEl: HTMLVideoElement | null) {
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
    public getVideoElement(): HTMLVideoElement | null {
        return this.videoElement;
    }

    /**
     * @returns If a `<video>` element is attached, it returns the current [[PlaybackState]] as an object.
     * Otherwise, returns [[defaultPlaybackState]].
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
        // Errors will be exposed by the native error handler of vidi
        try {
            const res: any = this.videoElement.play();
            if (res && res.catch) {
                res.catch(() => { });
            }
        } catch (e) {
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

        // Errors will be exposed by the native error handler of vidi
        try {
            const res: any = this.videoElement.pause();
            if (res && res.catch) {
                res.catch(() => { });
            }
        } catch (e) {
        }
    }

    /**
     * Sets the preferred initial bitrate for adaptive playback.
     * This will only affect playback via MSE-based libraries, where we have
     * the ability to specify it. Native adaptive playback will not be
     * affected and will still use the browser's default behavior.
     */
    public setInitialBitrate(bitrate: number) {
        this.initialBitrate = bitrate;
    }

    /**
     * Sets the current level for the 
     */
    public setMediaLevel(index: number) {
        if (this.attachedStream && this.videoElement) {
            this.attachedStream.setMediaLevel(index, this.videoElement);
        }
    }

    // Private helpers
    private autoDetectSourceTypes(mediaSources: MediaSource[]): MediaStream[] {
        return mediaSources.map(mediaSource => {
            if (typeof mediaSource === 'string') {
                return { url: mediaSource, type: detectStreamType(mediaSource) };
            } else {
                return mediaSource;
            }
        });
    }

    private resolvePlayableStreams() {
        if (!this.currentSrc) {
            this.playableStreams = [];
            return;
        }
        const mediaSources = new Array<MediaSource>().concat(this.currentSrc);
        const mediaStreams = this.autoDetectSourceTypes(mediaSources);
        this.playableStreams = resolvePlayableStreams(mediaStreams, this.playableStreamCreators, this.emit.bind(this));
    }

    private connectStreamToVideo() {
        if (!this.playableStreams || !this.videoElement) {
            return;
        }

        if (this.playableStreams.length > 0) {
            // Use the first PlayableStream for now
            // Later, we can use the others as fallback
            this.attachedStream = this.playableStreams[0];
            this.attachedStream.attach(this.videoElement, this.initialBitrate);
        }
    }

    private detachCurrentStream() {
        if (this.attachedStream && this.videoElement) {
            this.attachedStream.detach(this.videoElement);
            this.attachedStream = null;
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
            handler(event);
        } else {
            throw `Received a native event without an handler: ${event.type}`;
        }
    }
}
