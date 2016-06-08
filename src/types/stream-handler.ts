import {Stream} from './stream';

export interface StreamHandler {
    /**
     * Whether the stream handler supported on the current platform and browser
     */
    isSupported(): boolean;

    /**
     * Whether a stream is playable using the handler
     */
    canPlay(stream: Stream, handlers: StreamHandler[]): boolean;

    /**
     * Attach the handler to a <video> element
     */
    attachHandler(videoElement: HTMLVideoElement, stream: Stream): void;

    /**
     * Detach handler from a <video> element
     */
    detachHandler(videoElement: HTMLVideoElement): void;
}
