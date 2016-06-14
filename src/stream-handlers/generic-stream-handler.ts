import {MediaStream, MediaStreamHandler, MediaStreamType} from '../types';

export class GenericStreamHandler implements MediaStreamHandler {
    isSupported(): boolean {
        return true;
    };

    canHandleStream(mediaStream: MediaStream) {
        const type = mediaStream.type;
        if (type === MediaStreamType.MP4 || type === MediaStreamType.WEBM) {
            return true;
        } else {
            return false;
        }
    }

    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream): void {
        videoElement.src = mediaStream.url;
    }

    detach(videoElement: HTMLVideoElement) {
        videoElement.src = '';
    }
}
