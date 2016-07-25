import {MediaStream, PlayableStream, MediaStreamTypes, EnvironmentSupport, EmitEventsFn, MediaStreamDeliveryType} from '../../types';

const Shaka = require('shaka-player');

export class ShakaStream implements PlayableStream {
    private shakaPlayer = null;

    constructor(private mediaStreams: MediaStream[], private emit: EmitEventsFn) {
    }

    public attach(videoElement: HTMLVideoElement) {
        this.shakaPlayer = new Shaka.Player(videoElement);
        this.shakaPlayer.load(this.mediaStreams[0].url)
    }

    public detach(videoElement: HTMLVideoElement) {
        this.shakaPlayer.destroy()
        this.shakaPlayer = null;
    }

    public getMediaStreamDeliveryType() {
        return MediaStreamDeliveryType.ADAPTIVE_VIA_MSE;
    }

    public static isSupported(env: EnvironmentSupport): boolean {
        return env.MSE;
    };

    public static canPlay(mediaType: string): boolean {
        return mediaType === MediaStreamTypes.DASH;
    }

    public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
        //
    }
}
