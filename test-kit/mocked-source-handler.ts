import {MediaStream, MediaSource, MediaStreamTypes} from '../src/types'

export function createdMockedSourceHandler({canHandleSource = true, mediaStream = { url: '', type: MediaStreamTypes.MP4 }} = {}) {
    return {
        canHandleSource(src: MediaSource): boolean { return canHandleSource; },
        getMediaStream(src: MediaSource): MediaStream { return mediaStream }
    };
}
