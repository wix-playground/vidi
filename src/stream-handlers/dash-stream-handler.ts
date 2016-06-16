import {MediaStream, MediaStreamHandler, MediaStreamType} from '../types';
const DashMediaPlayer = require('dashjs/dist/src/streaming/MediaPlayer').default();

export class DashStreamHandler implements MediaStreamHandler {
    private dashPlayer = null;

    constructor() {
        this.dashPlayer = DashMediaPlayer.create();
        this.dashPlayer.getDebug().setLogToBrowserConsole(false);

        if (this.isSupported()) {
            this.dashPlayer.initialize(null, null, false);
        }
    }

    isSupported(): boolean {
        return typeof window !== 'undefined' && true;
    };

    canHandleStream(mediaStream: MediaStream) {
        if (mediaStream.type === MediaStreamType.DASH) {
            return true;
        } else {
            return false;
        }
    }

    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream) {
        let workaroundApplied = false;
        if (window !== undefined && window['dashjs'] === undefined) {
            window['dashjs'] = {}
            workaroundApplied = true;
        }
        this.dashPlayer.attachView(videoElement);
        this.dashPlayer.attachSource(mediaStream.url);

        if (workaroundApplied) {
            delete window['dashjs'];
        }
    }

    detach(videoElement: HTMLVideoElement) {
        this.dashPlayer.reset()
        videoElement.src = '';
    }
}
