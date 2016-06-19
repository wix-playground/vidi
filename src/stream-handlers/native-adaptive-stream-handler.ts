import {MediaStream, MediaStreamHandler, MediaStreamType} from '../types';
import {envSupports} from '../utils';

export class NativeAdaptiveStreamHandler implements MediaStreamHandler {
    isSupported(): boolean {
        return envSupports.HLS || envSupports.DASH;
    };

    canHandleStream(mediaStream: MediaStream) {
        const type = mediaStream.type;
        if (type === MediaStreamType.HLS && envSupports.HLS) {
            // Edge supports native DASH, but appears to have some bugs (seeking and too much buffering)
            // || (type === MediaStreamType.DASH && envSupports.DASH)
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
