export type Stream = string;

export interface StreamHandler {
    /**
     * Whether the stream handler supported on the current platform and browser
     */
    isSupported(): boolean;

    /**
     * Whether a stream is playable using the handler
     */
    canPlay(stream: Stream): boolean;

    /**
     * Attach the handler to a <video> element
     */
    attachHandler(videoElement: HTMLVideoElement, stream: Stream);

    /**
     * Detach handler from a <video> element
     */
    detachHandler(videoElement: HTMLVideoElement);
}
