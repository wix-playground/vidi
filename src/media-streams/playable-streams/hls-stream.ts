const Hls = require('hls.js/vidi/src/index.js');
import {MediaStream, PlayableStream, MediaStreamTypes, MediaLevel, EmitEventsFn, EnvironmentSupport, MediaStreamDeliveryType} from '../../types';

export class HlsStream implements PlayableStream {
    private hls = null;
    private mediaStream: MediaStream = null;

    constructor(mediaStreams: MediaStream[], private emit: EmitEventsFn) {
        if (mediaStreams.length === 1) {
            this.mediaStream = mediaStreams[0];
        } else {
            throw new Error(`Vidi can only handle a single HLS stream. Received ${mediaStreams.length} streams.`)
        }

        this.onManifestParsed = this.onManifestParsed.bind(this);
    }

    public attach(videoElement: HTMLVideoElement) {
        this.hls = new Hls();
        this.hls.attachMedia(videoElement);
        this.hls.loadSource(this.mediaStream.url);
        this.hls.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed);
        window['hls'] = this.hls;
    }

    public detach(videoElement: HTMLVideoElement) {
        this.hls.off(Hls.Events.MANIFEST_PARSED, this.onManifestParsed);
        this.hls.destroy();
        this.hls = null;
    }

    public getMediaStreamDeliveryType() {
        return MediaStreamDeliveryType.ADAPTIVE_VIA_MSE;
    }

    public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
        // TODO
    }

    private onManifestParsed() {
        this.emit('levels', this.getMediaLevels())
    }

    private getMediaLevels(): MediaLevel[] {
        if (!this.hls.levels || !this.hls.levels.length) {
            return [];
        }

        return this.hls.levels.map(level => {
            return { bitrate: level.bitrate, width: level.width, height: level.height };
        })
    }

    public static isSupported(env: EnvironmentSupport): boolean {
        return env.MSE && Hls.isSupported();
    };

    public static canPlay(mediaType: string): boolean {
        return mediaType === MediaStreamTypes.HLS;
    }

}
