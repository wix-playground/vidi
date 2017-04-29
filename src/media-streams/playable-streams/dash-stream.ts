import {
    MediaStream, PlayableStream, MediaStreamTypes, MediaLevel, EmitEventsFn,
    EnvironmentSupport, MediaStreamDeliveryType, Errors
} from '../../types';

import {MediaPlayer} from 'dashjs';

const DashEvents = MediaPlayer['events'];

interface DashJsBitrateInfo {
    bitrate: number;
    width: number;
    height: number;
}

export class DashStream implements PlayableStream {
    private dashPlayer: any = null;
    private mediaStream: MediaStream | null = null;

    constructor(mediaStreams: MediaStream[], private emit: EmitEventsFn) {
        if (mediaStreams.length === 1) {
            this.mediaStream = mediaStreams[0];
        } else {
            throw new Error(`Vidi can only handle a single DASH stream. Received ${mediaStreams.length} streams.`)
        }
    }

    public attach(videoElement: HTMLVideoElement, initialBitrate: number) {
        if (!this.mediaStream) {
            return;
        }
        this.dashPlayer = MediaPlayer().create();
        this.dashPlayer.getDebug().setLogToBrowserConsole(false);
        this.dashPlayer.on(DashEvents.STREAM_INITIALIZED, this.onStreamInitialized);
        this.dashPlayer.on(DashEvents.ERROR, this.onError);
        this.dashPlayer.initialize(videoElement, this.mediaStream.url, videoElement.autoplay);
        if (initialBitrate) {
            this.dashPlayer.setInitialBitrateFor('video', initialBitrate);
        }
    }

    public detach(videoElement: HTMLVideoElement) {
        if (!this.mediaStream) {
            return;
        }
        this.dashPlayer.reset()
        this.dashPlayer.off(DashEvents.STREAM_INITIALIZED, this.onStreamInitialized);
        this.dashPlayer.off(DashEvents.ERROR, this.onError);
        this.dashPlayer = null;
    }

    public getMediaStreamDeliveryType() {
        return MediaStreamDeliveryType.ADAPTIVE_VIA_MSE;
    }

    public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
        // TODO
    }

    private onError = (errorEvent) => {
        if (!errorEvent) {
            return;
        }
        if (errorEvent.error === 'manifestError' || (errorEvent.error === 'download' && errorEvent.event.id === 'manifest')) {
            this.emit('error', Errors.SRC_LOAD_ERROR, this.mediaStream && this.mediaStream.url, errorEvent);
        }
    }

    private getMediaLevels(): MediaLevel[] {
        if (!this.dashPlayer) {
            return [];
        }

        const bitrates = this.dashPlayer.getBitrateInfoListFor('video') as DashJsBitrateInfo[] || [];

        return bitrates.map(bitrateInfo => {
            return { bitrate: bitrateInfo.bitrate, width: bitrateInfo.width, height: bitrateInfo.height };
        });

    }

    private onStreamInitialized = () => {
        this.emit('levels', this.getMediaLevels())
    }
    public static isSupported(env: EnvironmentSupport): boolean {
        return env.MSE;
    };

    public static canPlay(mediaType: string): boolean {
        return mediaType === MediaStreamTypes.DASH;
    }

}
