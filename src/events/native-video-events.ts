import { PlaybackStatus } from '../types';
import { Vidi } from '../vidi';

export function getNativeEventsHandlers(vidi: Vidi) {

    // Verifies the vidi instance is still connected to the HTMLVideoElement
    function verifyVideoAndCall(callback: (videoElement: HTMLVideoElement) => void) {
        const videoElement = vidi.getVideoElement();
        videoElement && callback(videoElement);
    }

    return {
        loadstart() {
            verifyVideoAndCall(() => vidi.emit('loadstart', vidi.getPlaybackState()));
        },

        durationchange() {
            verifyVideoAndCall((videoElement) => vidi.emit('durationchange', videoElement.duration));
        },

        timeupdate() {
            verifyVideoAndCall((videoElement) => vidi.emit('timeupdate', videoElement.currentTime));
        },

        ratechange() {
            verifyVideoAndCall((videoElement) => vidi.emit('ratechange', videoElement.playbackRate));
        },

        volumechange() {
            verifyVideoAndCall((videoElement) => vidi.emit('volumechange', { volume: videoElement.volume, muted: videoElement.muted }));
        },

        play() {
            verifyVideoAndCall(() => vidi.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING));
        },

        playing() {
            verifyVideoAndCall(() => vidi.emit('statuschange', PlaybackStatus.PLAYING));
        },

        pause() {
            verifyVideoAndCall(() => vidi.emit('statuschange', PlaybackStatus.PAUSED));
        },

        seeking() {
            verifyVideoAndCall((videoElement) => {
                if (videoElement.paused) {
                    vidi.emit('statuschange', PlaybackStatus.PAUSED_BUFFERING);
                } else {
                    vidi.emit('statuschange', PlaybackStatus.PLAYING_BUFFERING);
                }
            });
        },

        seeked() {
            verifyVideoAndCall((videoElement) => {
                if (videoElement.paused) {
                    vidi.emit('statuschange', PlaybackStatus.PAUSED);
                } else {
                    vidi.emit('statuschange', PlaybackStatus.PLAYING);
                }
            });
        },

        ended() {
            verifyVideoAndCall(() => vidi.emit('statuschange', PlaybackStatus.ENDED));
        },

        error() {
            verifyVideoAndCall((videoElement) => vidi.emit('error', videoElement.error));
        }
    };

}
