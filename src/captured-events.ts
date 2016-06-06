import {PlaybackStatus} from './playback-state';

export const nativeVideoEvents = {
    'loadstart': function () {
        this.emit('loadstart', this.getPlaybackState());
    },
    
    'durationchange': function () {
        this.emit('durationchange', this.nativeVideoEl.duration)
    },
    
    'timeupdate': function () {
        this.emit('timeupdate', this.nativeVideoEl.currentTime)
    },
    
    'ratechange': function () {
        this.emit('ratechange', this.nativeVideoEl.playbackRate)
    },
    
    'volumechange': function () {
        this.emit('volumechange', { volume: this.nativeVideoEl.volume, muted: this.nativeVideoEl.muted })
    },
    
    'play': function () {
        this.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
    },
    
    'playing': function () {
        this.emit('statuschange', PlaybackStatus.PLAYING)
    },
    
    'pause': function () {
        this.emit('statuschange', PlaybackStatus.PAUSED)
    },
    
    'seeking': function () {
        if (this.nativeVideoEl.paused) {
            this.emit('statuschange', PlaybackStatus.PAUSED_BUFFERING)
        } else {
            this.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
        }
    },
    
    'seeked': function () {
        if (this.nativeVideoEl.paused) {
            this.emit('statuschange', PlaybackStatus.PAUSED)
        } else {
            this.emit('statuschange', PlaybackStatus.PLAYING)
        }
    },
    
    'ended': function () {
        this.emit('statuschange', PlaybackStatus.ENDED)
    },
    
    'error': function () {
        this.handleNativeError(this.nativeVideoEl.error);
    }
};
