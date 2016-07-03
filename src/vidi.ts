import EventEmitter = require('eventemitter3');
import {getNativeEventsHandlers} from './events';
import {PlaybackState, defaultPlaybackState, PlaybackStatus, MediaSource, MediaSourceHandler, MediaStreamTypes, MediaStream, MediaStreamHandler} from './types';
import {MediaStreamSourceHandler, URLSourceHandler} from './source-handlers';
import {HlsStreamHandler, DashStreamHandler, NativeStreamHandler/*, ShakaStreamHandler*/} from './stream-handlers';

export class Vidi extends EventEmitter {
    static PlaybackStatus = PlaybackStatus;
    static MediaStreamTypes = MediaStreamTypes;

    private videoElement: HTMLVideoElement = null; // The current HTMLVideoElement
    private sourceHandlers: MediaSourceHandler[] = [];
    private streamHandlers: MediaStreamHandler[] = [];
    private currentSrc: MediaSource = null;
    private attachedStreamHandler: MediaStreamHandler = null;
    private nativeEventHandlers = getNativeEventsHandlers(this);

    constructor(nativeVideoEl: HTMLVideoElement = null) {
        super();
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

    // Public API

    set src(src: MediaSource) {
        if (src === this.currentSrc) {
            return;
        }
        this.detachCurrentStreamHandler();

        this.currentSrc = src;
        this.connectSourceToVideo();
    }

    get src(): MediaSource {
        return this.currentSrc;
    }

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

    public getVideoElement(): HTMLVideoElement {
        return this.videoElement;
    }

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

    public getSourceHandlers(): MediaSourceHandler[] {
        return this.sourceHandlers;
    }

    public registerSourceHandler(sourceHandler: MediaSourceHandler) {
        this.sourceHandlers.unshift(sourceHandler);
    }

    public getStreamHandlers(): MediaStreamHandler[] {
        return this.streamHandlers;
    }

    public registerStreamHandler(streamHandler: MediaStreamHandler) {
        this.streamHandlers.unshift(streamHandler);
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

    // No real error handling yet
    private handleNativeError(error) {
        this.emit('error', error);
    }
}
