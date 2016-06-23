import {PlaybackStatus} from '../types';
import {Vidi} from '../vidi';

export function getNativeEventsHandlers(vidi: Vidi) {
    return {
        'loadstart': function () {
            vidi.emit('loadstart', vidi.getPlaybackState());
        },

        'durationchange': function () {
            vidi.emit('durationchange', vidi.getVideoElement().duration)
        },

        'timeupdate': function () {
            vidi.emit('timeupdate', vidi.getVideoElement().currentTime)
        },

        'ratechange': function () {
            vidi.emit('ratechange', vidi.getVideoElement().playbackRate)
        },

        'volumechange': function () {
            vidi.emit('volumechange', { volume: vidi.getVideoElement().volume, muted: vidi.getVideoElement().muted })
        },

        'play': function () {
            vidi.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
        },

        'playing': function () {
            vidi.emit('statuschange', PlaybackStatus.PLAYING)
        },

        'pause': function () {
            vidi.emit('statuschange', PlaybackStatus.PAUSED)
        },

        'seeking': function () {
            if (vidi.getVideoElement().paused) {
                vidi.emit('statuschange', PlaybackStatus.PAUSED_BUFFERING)
            } else {
                vidi.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
            }
        },

        'seeked': function () {
            if (vidi.getVideoElement().paused) {
                vidi.emit('statuschange', PlaybackStatus.PAUSED)
            } else {
                vidi.emit('statuschange', PlaybackStatus.PLAYING)
            }
        },

        'ended': function () {
            vidi.emit('statuschange', PlaybackStatus.ENDED)
        },

        'error': function () {
            vidi.emit('error', vidi.getVideoElement().error);
        }
    };

}
