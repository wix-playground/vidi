import {MediaStream} from './media-stream';

export type MediaSource = any;

export interface MediaSourceHandler {
    /**
     * Whether it can handle a provided MediaSource
     */
    canHandleSource(src: MediaSource): boolean;

    /**
     * Get a MediaStream from a provided source
     */
    getMediaStream(src: MediaSource): MediaStream;
}
