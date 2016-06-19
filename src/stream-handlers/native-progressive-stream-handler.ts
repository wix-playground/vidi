import {MediaStream, MediaStreamHandler, MediaStreamType} from '../types';
import {envSupports} from '../utils';

export class NativeProgressiveStreamHandler implements MediaStreamHandler {
    isSupported(): boolean {
        return envSupports.MP4 || envSupports.WEBM;
    };

    canHandleStream(mediaStream: MediaStream) {
        const type = mediaStream.type;
        if ((type === MediaStreamType.MP4 && envSupports.MP4) || (type === MediaStreamType.WEBM && envSupports.WEBM)) {
            return true;
        } else {
            return false;
        }
    }

    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream): void {
        videoElement.src = mediaStream.url;
    }

    detach(videoElement: HTMLVideoElement) {
    }
}
