import {MediaStream, MediaStreamHandler, MediaStreamType} from '../types';
import {envSupports} from '../utils';

const DashMediaPlayer = require('dashjs/dist/src/streaming/MediaPlayer').default();

export class DashStreamHandler implements MediaStreamHandler {
    private dashPlayer = null;

    isSupported(): boolean {
        return envSupports.MSE;
    };

    canHandleStream(mediaStream: MediaStream) {
        if (mediaStream.type === MediaStreamType.DASH) {
            return true;
        } else {
            return false;
        }
    }

    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream) {
        this.dashPlayer = DashMediaPlayer.create();
        this.dashPlayer.getDebug().setLogToBrowserConsole(false);
        this.dashPlayer.initialize(null, null, false);

        window['dashjs'] = {} // Workaround for dashjs trying to access global variable
        this.dashPlayer.attachView(videoElement);
        this.dashPlayer.attachSource(mediaStream.url);
        delete window['dashjs'];
    }

    detach(videoElement: HTMLVideoElement) {
        this.dashPlayer.reset()
        this.dashPlayer = null;
    }
}
