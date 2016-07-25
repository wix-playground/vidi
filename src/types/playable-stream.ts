import {MediaStream, MediaStreamDeliveryType} from './media-stream';
import {EmitEventsFn} from './event-listener';
import {EnvironmentSupport} from './environment-support';

export interface PlayableStream {
    /**
     * Attach the handler to a `<video>` element.
     */
    attach(videoElement: HTMLVideoElement): void;

    /**
     * Detach handler from a `<video>` element.
     */
    detach(videoElement: HTMLVideoElement): void;

    getMediaStreamDeliveryType(): MediaStreamDeliveryType;

    setMediaLevel(newLevel: number, videoElement: HTMLVideoElement): void;
}

export interface PlayableStreamCreator {
    new (mediaStreams: MediaStream[], emit: EmitEventsFn): PlayableStream;

    isSupported(env: EnvironmentSupport): boolean;

    canPlay(mediaType: string): boolean;

}
