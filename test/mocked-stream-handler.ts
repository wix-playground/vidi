import {Stream} from '../src/types'

export function createdMockedStreamHandler({isSupported = true, canPlay = true} = {}) {
    return {
        attachHandlerCalled: false,
        attachCallCount: 0,
        detachHandlerCalled: false,
        detachCallCount: 0,

        isSupported() { return isSupported; },
        canPlay(stream: Stream) { return canPlay; },
        attachHandler(videoElement: HTMLVideoElement, stream: Stream) { this.attachHandlerCalled = true; ++this.attachCallCount; },
        detachHandler(videoElement: HTMLVideoElement) { this.detachHandlerCalled = true; ++this.detachCallCount; }
    };
}
