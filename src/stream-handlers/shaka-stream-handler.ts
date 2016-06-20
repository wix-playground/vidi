import {MediaStream, MediaStreamHandler, MediaStreamTypes} from '../types';
import {envSupports} from '../utils';

const Shaka = require('shaka-player');

export class ShakaStreamHandler implements MediaStreamHandler {
    private shakaPlayer = null;

    isSupported(): boolean {
        return envSupports.MSE;
    };

    canHandleStream(mediaStream: MediaStream) {
        return mediaStream.type === MediaStreamTypes.DASH;
    }

    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream) {
        this.shakaPlayer = new Shaka.Player(videoElement);
        this.shakaPlayer.load(mediaStream.url)
    }

    detach(videoElement: HTMLVideoElement) {
        this.shakaPlayer.destroy()
        this.shakaPlayer = null;
    }
}
