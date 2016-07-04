import {MediaStream, MediaStreamHandler, MediaStreamTypes} from '../types';
import {envSupports} from '../utils';

/**
 * Handles [[MediaStream]]s with any Vidi-supported [[MediaStreamTypes]] using
 * native playback capabilities (simply setting the src).
 * 
 * Each instance is given a type to handle during construction, and
 * is checked using the singelton [[envSupports]] for support on the current platform.
 */
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