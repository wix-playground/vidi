import {MediaSource, MediaSourceHandler, MediaStream, MediaStreamTypes} from '../types';

/**
 * Handles MediaStream objects as source
 * The user can specify the type of MediaStream, so if a URL
 */
export class MediaStreamSourceHandler implements MediaSourceHandler {
    canHandleSource(src: MediaSource): boolean {
        return (src !== null && typeof src === 'object' && src.url !== undefined && src.type !== undefined);
    }

    getMediaStream(src: MediaSource): MediaStream {
        return src;
    }
}
