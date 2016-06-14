import {PlaybackStatus} from '../types';
import {Videoholic} from '../videoholic';

export function getNativeEventsHandlers(videoholic: Videoholic) {
    return {
        'loadstart': function () {
            videoholic.emit('loadstart', videoholic.getPlaybackState());
        },

        'durationchange': function () {
            videoholic.emit('durationchange', videoholic.getVideoElement().duration)
        },

        'timeupdate': function () {
            videoholic.emit('timeupdate', videoholic.getVideoElement().currentTime)
        },

        'ratechange': function () {
            videoholic.emit('ratechange', videoholic.getVideoElement().playbackRate)
        },

        'volumechange': function () {
            videoholic.emit('volumechange', { volume: videoholic.getVideoElement().volume, muted: videoholic.getVideoElement().muted })
        },

        'play': function () {
            videoholic.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
        },

        'playing': function () {
            videoholic.emit('statuschange', PlaybackStatus.PLAYING)
        },

        'pause': function () {
            videoholic.emit('statuschange', PlaybackStatus.PAUSED)
        },

        'seeking': function () {
            if (videoholic.getVideoElement().paused) {
                videoholic.emit('statuschange', PlaybackStatus.PAUSED_BUFFERING)
            } else {
                videoholic.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING)
            }
        },

        'seeked': function () {
            if (videoholic.getVideoElement().paused) {
                videoholic.emit('statuschange', PlaybackStatus.PAUSED)
            } else {
                videoholic.emit('statuschange', PlaybackStatus.PLAYING)
            }
        },

        'ended': function () {
            videoholic.emit('statuschange', PlaybackStatus.ENDED)
        },

        'error': function () {
            videoholic.emit('error', videoholic.getVideoElement().error);
        }
    };

}
