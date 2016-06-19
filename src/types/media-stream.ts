export const MediaStreamTypes = {
    MP4: 'MP4',
    WEBM: 'WEBM',
    HLS: 'HLS',
    DASH: 'DASH'
}

export interface MediaStream {
    url: string;
    type: string;
};

export interface MediaStreamHandler {
    /**
     * Whether the handler is supported under the current browser and OS
     */
    isSupported(): boolean;

    /**
     * Whether a media stream is playable using the handler
     */
    canHandleStream(mediaStream: MediaStream): boolean;

    /**
     * Attach the handler to a <video> element
     */
    attach(videoElement: HTMLVideoElement, mediaStream: MediaStream): void;

    /**
     * Detach handler from a <video> element
     */
    detach(videoElement: HTMLVideoElement): void;
}
