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

    initHandler(stream: Stream);
}
