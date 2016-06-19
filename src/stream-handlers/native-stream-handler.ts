import {MediaStream, MediaStreamHandler, MediaStreamTypes} from '../types';
import {envSupports} from '../utils';

export class NativeStreamHandler implements MediaStreamHandler {
    constructor(private streamType: string){
    }

    isSupported(): boolean {
        return envSupports[this.streamType];
    };

    canHandleStream(mediaStream: MediaStream) {
        return mediaStream.type === MediaStreamTypes[this.streamType];
    }

    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream): void {
        videoElement.src = mediaStream.url;
    }

    detach(videoElement: HTMLVideoElement) {
    }
}