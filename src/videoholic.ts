import EventEmitter = require('eventemitter3');
import {nativeVideoEvents} from './events';
import {StreamHandler, Stream, PlaybackState, defaultPlaybackState, PlaybackStatus, StreamType} from './types';

export class Videoholic extends EventEmitter {
    static PlaybackStatus = PlaybackStatus;
    static StreamType = StreamType;

    private videoElement: HTMLVideoElement = null; // The current HTMLVideoElement
    private streamHandlers: StreamHandler[] = [];   // All registered stream handlers
    private attachedHandler: StreamHandler = null;  // Currently attached stream handler
    private currentSrc: Stream = null;

    constructor(nativeVideoEl: HTMLVideoElement = null, options?: Object) {
        super();
        this.onNativeEvent = this.onNativeEvent.bind(this);

        this.setVideoElement(nativeVideoEl);
    }

    // Public API

    set src(src: Stream) {
        if (src === this.currentSrc) {
            return;
        }

        this.detachCurrentHandler();
        this.currentSrc = src;
        this.attachCompatibleHandler();
    }

    get src(): Stream {
        return this.currentSrc;
    }

    public setVideoElement(nativeVideoEl: HTMLVideoElement) {
        if (this.videoElement === nativeVideoEl) {
            return;
        }

        this.removeVideoListeners(this.videoElement);
        this.detachCurrentHandler();
        this.videoElement = nativeVideoEl;
        this.addVideoListeners(this.videoElement);
        this.attachCompatibleHandler();

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

    public getSupportedHandlers(): StreamHandler[] {
        return this.getAllHandlers().filter(handler => handler.isSupported());
    }

    public getAllHandlers(): StreamHandler[] {
        return this.streamHandlers;
    }

    public registerHandler(stream: StreamHandler) {
        this.streamHandlers.unshift(stream);
    }

    // Private helpers

    private attachCompatibleHandler() {
        if (!this.currentSrc || !this.videoElement) {
            return;
        }

        const streamHandlers: StreamHandler[] = this.getSupportedHandlers();
        const compatibleHandlers: StreamHandler[] = [];
        for (let i = 0; i < streamHandlers.length; ++i) {
            const handler = streamHandlers[i];
            const otherHandlers = streamHandlers.filter(h => h !== handler);
            if (handler.canPlay(this.currentSrc, otherHandlers)) {
                compatibleHandlers.push(handler);
            }
        }

        if (compatibleHandlers.length) {
            const toAttach = compatibleHandlers[0]; // Currently use the first compatible handler
            toAttach.attachHandler(this.videoElement, this.currentSrc);
            this.attachedHandler = toAttach;
        } else {
            throw new Error('No compatible handler was found for current src.')
        }
    }

    private detachCurrentHandler() {
        if (this.attachedHandler) {
            this.attachedHandler.detachHandler(this.videoElement);
            this.attachedHandler = null;
        }
    }

    private addVideoListeners(videoElement) {
        if (!videoElement) {
            return;
        }

        Object.keys(nativeVideoEvents).forEach(e => videoElement.addEventListener(e, this.onNativeEvent));
    }

    private removeVideoListeners(videoElement) {
        if (!videoElement) {
            return;
        }

        Object.keys(nativeVideoEvents).forEach(e => videoElement.removeEventListener(e, this.onNativeEvent));
    }

    private onNativeEvent(event: Event) {
        if (event.target !== this.videoElement) {
            return;
        }

        const handler = nativeVideoEvents[event.type];
        if (nativeVideoEvents[event.type]) {
            handler.call(this);
        } else {
            throw `Received a native event without an handler: ${event.type}`;
        }
    }

    // No real error handling yet
    private handleNativeError(error) {
        throw new Error(`Video error: ${error}`);
    }
}
