import {StreamHandler, Stream} from '../types';

export class GenericStreamHandler implements StreamHandler {
    isSupported(): boolean {
        return true;
    }

    canPlay(stream: Stream): boolean {
        return true;
    }

    attachHandler(videoElement: HTMLVideoElement, stream: Stream) {
        videoElement.src = stream; 
    }

    detachHandler(videoElement: HTMLVideoElement) {
        videoElement.src = '';
    }
}
