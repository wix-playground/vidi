import {MediaStream, MediaStreamHandler} from '../src/types'

export function createMockedStreamHandler({isSupported = true, canPlay = true} = {}){
    return {
        attachCalled: false,
        attachCallCount: 0,
        detachCalled: false,
        detachCallCount: 0,

        isSupported() { return isSupported; },
        canHandleStream(mediaStream: MediaStream) { return canPlay; },
        attach(videoElement: HTMLVideoElement, mediaStream: MediaStream) { this.attachCalled = true; ++this.attachCallCount; },
        detach(videoElement: HTMLVideoElement) { this.detachCalled = true; ++this.detachCallCount; }
    };
}
