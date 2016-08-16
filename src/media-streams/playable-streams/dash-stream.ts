import {MediaStream, PlayableStream, MediaStreamTypes, MediaLevel, EmitEventsFn, EnvironmentSupport, MediaStreamDeliveryType} from '../../types';

require('dashjs/dist/dash.all.min');
const DashMediaPlayer = window['dashjs'].MediaPlayer();
const DashEvents = window['dashjs'].MediaPlayer.events;

export class DashStream implements PlayableStream {
    private dashPlayer = null;
    private mediaStream: MediaStream = null;

    constructor(mediaStreams: MediaStream[], private emit: EmitEventsFn) {
        if (mediaStreams.length === 1) {
            this.mediaStream = mediaStreams[0];
        } else {
            throw new Error(`Vidi can only handle a single DASH stream. Received ${mediaStreams.length} streams.`)
        }

        this.onStreamInitialized = this.onStreamInitialized.bind(this);
    }

    public attach(videoElement: HTMLVideoElement) {
        this.dashPlayer = DashMediaPlayer.create();
        this.dashPlayer.getDebug().setLogToBrowserConsole(false);
        this.dashPlayer.initialize(videoElement, this.mediaStream.url, videoElement.autoplay);
        this.dashPlayer.on(DashEvents.STREAM_INITIALIZED, this.onStreamInitialized);
    }

    public detach(videoElement: HTMLVideoElement) {
        this.dashPlayer.reset()
        this.dashPlayer.off(DashEvents.STREAM_INITIALIZED, this.onStreamInitialized);
        this.dashPlayer = null;
    }

    public getMediaStreamDeliveryType() {
        return MediaStreamDeliveryType.ADAPTIVE_VIA_MSE;
    }

    public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
        // TODO
    }

    private getMediaLevels(): MediaLevel[] {
        if (!this.dashPlayer) {
            return [];
        }

        const bitrates = this.dashPlayer.getBitrateInfoListFor('video');

        if (bitrates && bitrates.map) {
            return bitrates.map(bitrateInfo => {
                return { bitrate: bitrateInfo.bitrate, width: bitrateInfo.width, height: bitrateInfo.height };
            });
        } else {
            return [];
        }

    }

    private onStreamInitialized() {
        this.emit('levels', this.getMediaLevels())
    }
    public static isSupported(env: EnvironmentSupport): boolean {
        return env.MSE;
    };

    public static canPlay(mediaType: string): boolean {
        return mediaType === MediaStreamTypes.DASH;
    }
    
}
