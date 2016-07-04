import {MediaStream, MediaStreamHandler, MediaStreamTypes} from '../types';
import {envSupports} from '../utils';

const DashMediaPlayer = require('dashjs/dist/src/streaming/MediaPlayer').default();

/**
 * Handles [[MediaStream]]s with type [[MediaStreamTypes.DASH]] using
 * [dash.js](https://github.com/Dash-Industry-Forum/dash.js).
 */
export class DashStreamHandler implements MediaStreamHandler {
    private dashPlayer = null;

    isSupported(): boolean {
        return envSupports.MSE;
    };

    canHandleStream(mediaStream: MediaStream) {
        return mediaStream.type === MediaStreamTypes.DASH;
    }

    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream) {
        this.dashPlayer = DashMediaPlayer.create();
        this.dashPlayer.getDebug().setLogToBrowserConsole(false);
        this.dashPlayer.initialize(null, null, videoElement.autoplay);

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
