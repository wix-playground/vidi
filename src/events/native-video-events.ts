import {PlaybackStatus} from '../types';

export const nativeVideoEvents = {
    'loadstart': function () {
        this.emit('loadstart', this.getPlaybackState());
    },
    
    'durationchange': function () {
        this.emit('durationchange', this.getVideoElement().duration)
    },
    
    'timeupdate': function () {
        this.emit('timeupdate', this.getVideoElement().currentTime)
    },
    
    'ratechange': function () {
        this.emit('ratechange', this.getVideoElement().playbackRate)
    },
    
    'volumechange': function () {
        this.emit('volumechange', { volume: this.getVideoElement().volume, muted: this.getVideoElement().muted })
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
        if (this.getVideoElement().paused) {
            this.emit('statuschange', PlaybackStatus.PAUSED_BUFFERING)
        } else {
            this.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
        }
    },
    
    'seeked': function () {
        if (this.getVideoElement().paused) {
            this.emit('statuschange', PlaybackStatus.PAUSED)
        } else {
            this.emit('statuschange', PlaybackStatus.PLAYING)
        }
    },
    
    'ended': function () {
        this.emit('statuschange', PlaybackStatus.ENDED)
    },
    
    'error': function () {
        this.handleNativeError(this.getVideoElement().error);
    }
};
