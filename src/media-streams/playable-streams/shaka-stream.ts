import { MediaStream, PlayableStream, MediaStreamTypes, EnvironmentSupport, EmitEventsFn, MediaStreamDeliveryType } from '../../types';

const Shaka = require('shaka-player');
Shaka.polyfill.installAll();
export class ShakaStream implements PlayableStream {
    private shakaPlayer: any = null;

    constructor(private mediaStreams: MediaStream[], private emit: EmitEventsFn) {
    }

    public attach(videoElement: HTMLVideoElement, initialBitrate: number) {
        this.shakaPlayer = new Shaka.Player(videoElement);
        this.shakaPlayer.load(this.mediaStreams[0].url)
        this.shakaPlayer.addEventListener('error', (e) => this.emit('error', e));
        if (initialBitrate) {
            this.shakaPlayer.configure({ abr: { defaultBandwidthEstimate: initialBitrate } });
        }
    }

    public detach(videoElement: HTMLVideoElement) {
        this.shakaPlayer.destroy()
        this.shakaPlayer = null;
    }

    public getMediaStreamDeliveryType() {
        return MediaStreamDeliveryType.ADAPTIVE_VIA_MSE;
    }

    public static isSupported(env: EnvironmentSupport): boolean {
        return Shaka.Player.isBrowserSupported();
    };

    public static canPlay(mediaType: string): boolean {
        return mediaType === MediaStreamTypes.DASH;
    }

    public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
        //
    }
}
