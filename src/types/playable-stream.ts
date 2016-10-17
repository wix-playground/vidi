import {MediaStream, MediaStreamDeliveryType} from './media-stream';
import {EmitEventsFn} from './emit-events';
import {EnvironmentSupport} from './environment-support';

export interface PlayableStream {
    attach(videoElement: HTMLVideoElement): void;
    detach(videoElement: HTMLVideoElement): void;
    getMediaStreamDeliveryType(): MediaStreamDeliveryType;
    setMediaLevel(newLevel: number, videoElement: HTMLVideoElement): void;
}

export interface PlayableStreamCreator {
    new (mediaStreams: MediaStream[], emit: EmitEventsFn): PlayableStream;
    isSupported(env: EnvironmentSupport): boolean;
    canPlay(mediaType: string): boolean;
}
