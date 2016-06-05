import EventEmitter = require('eventemitter3');
import {nativeVideoEvents} from './captured-events';
import {PlaybackState, defaultPlaybackState, PlaybackStatus} from './playback-state';

export class Videoholic extends EventEmitter {
    // The currently set nativeVideoEl
    private nativeVideoEl: HTMLVideoElement = null;
   
    static PlaybackStatus = PlaybackStatus;

    constructor(nativeVideoEl: HTMLVideoElement = null, options?: Object) {
        super();
        this.onNativeEvent = this.onNativeEvent.bind(this);
        this.setVideoElement(nativeVideoEl);
    }

    // Public API

    public setVideoElement(nativeVideoEl: HTMLVideoElement) {
        if (this.nativeVideoEl === nativeVideoEl) {
            return;
        }

        this.detachListeners();
        this.nativeVideoEl = nativeVideoEl;
        this.attachListeners();

    }

    public getVideoElement(): HTMLVideoElement {
        return this.nativeVideoEl;
    }

    public getPlaybackState(): PlaybackState {
        if (!this.nativeVideoEl) {
            return defaultPlaybackState;
        }
 
        const playbackState: PlaybackState = {
            currentTime: this.nativeVideoEl.currentTime,
            duration: this.nativeVideoEl.duration || 0,
            muted: this.nativeVideoEl.muted,
            playbackRate: this.nativeVideoEl.playbackRate,
            status: this.nativeVideoEl.paused ? PlaybackStatus.PAUSED : PlaybackStatus.PLAYING,
            volume: this.nativeVideoEl.volume
        };

        return playbackState;
    }

    public play() {
        if (!this.nativeVideoEl) {
            return;
        }

        try {
            const res: any = this.nativeVideoEl.play();
            if (res && res.catch) {
                res.catch(e => this.handleNativeError(e));
            }
        } catch (e) {
            this.handleNativeError(e);
        }
    }

    public pause() {
        if (!this.nativeVideoEl) {
            return;
        }

        try {
            const res: any = this.nativeVideoEl.pause();
            if (res && res.catch) {
                res.catch(e => this.handleNativeError(e));
            }
        } catch (e) {
            this.handleNativeError(e);
        }
    }
    
    // Helpers

    private attachListeners() {
        if (!this.nativeVideoEl) {
            return;
        }

        nativeVideoEvents.forEach(e => this.nativeVideoEl.addEventListener(e, this.onNativeEvent));
    }

    private detachListeners() {
        if (!this.nativeVideoEl) {
            return;
        }

        nativeVideoEvents.forEach(e => this.nativeVideoEl.removeEventListener(e, this.onNativeEvent));
    }


    // TODO: extract this into captured-events and refactor

    private onNativeEvent(event: Event) {
        if (event.target !== this.nativeVideoEl) {
            return;
        }

        switch (event.type) {
            case 'loadstart':
                this.emit('loadstart', this.getPlaybackState());
                break;

            case 'durationchange':
                this.emit('durationchange', this.nativeVideoEl.duration)
                break;

            case 'timeupdate':
                this.emit('timeupdate', this.nativeVideoEl.currentTime)
                break;

            case 'ratechange':
                this.emit('ratechange', this.nativeVideoEl.playbackRate)
                break;

            case 'volumechange':
                this.emit('volumechange', { volume: this.nativeVideoEl.volume, muted: this.nativeVideoEl.muted })
                break;

            case 'seeked':
                if (this.nativeVideoEl.paused) {
                    this.emit('statuschange', PlaybackStatus.PAUSED)
                } else {
                    this.emit('statuschange', PlaybackStatus.PLAYING)
                }
                break;

            case 'play':
                this.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
                break;

            case 'playing':
                this.emit('statuschange', PlaybackStatus.PLAYING)
                break;

            case 'pause':
                this.emit('statuschange', PlaybackStatus.PAUSED)
                break;
 
            case 'seeking':
                if (this.nativeVideoEl.paused) {
                    this.emit('statuschange', PlaybackStatus.PAUSED_BUFFERING)
                } else {
                    this.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
                }
                break;

            case 'ended':
                this.emit('statuschange', PlaybackStatus.ENDED)
                break;
                
            case 'error':
                this.handleNativeError(this.nativeVideoEl.error);
                break;
        }

    }
    
    
    // No real error handling yet
    private handleNativeError(error) {
        throw new Error(`Video error: ${error}`);
    }
}
