const HlsJs = require('hls.js/lib');
import {
    MediaStream, PlayableStream, MediaStreamTypes, MediaLevel, EmitEventsFn,
    EnvironmentSupport, MediaStreamDeliveryType, Errors
} from '../../types';

interface HlsJsLevel {
    bitrate: number;
    width: number;
    height: number;
}

export class HlsStream implements PlayableStream {
    private hls: any = null;
    private mediaStream: MediaStream | null = null;

    constructor(mediaStreams: MediaStream[], private emit: EmitEventsFn) {
        if (mediaStreams.length === 1) {
            this.mediaStream = mediaStreams[0];
        } else {
            throw new Error(`Vidi can only handle a single HLS stream. Received ${mediaStreams.length} streams.`)
        }
    }

    public attach(videoElement: HTMLVideoElement, initialBitrate: number) {
        if (!this.mediaStream) {
            return;
        }
        HlsJs.DefaultConfig.abrEwmaDefaultEstimate = initialBitrate * 1000;
        this.hls = new HlsJs();
        this.hls.on(HlsJs.Events.MANIFEST_PARSED, this.onManifestParsed);
        this.hls.on(HlsJs.Events.ERROR, this.onError);
        this.hls.loadSource(this.mediaStream.url);
        this.hls.attachMedia(videoElement);
    }

    public detach(videoElement: HTMLVideoElement) {
        if (!this.mediaStream) {
            return;
        }
        this.hls.off(HlsJs.Events.MANIFEST_PARSED, this.onManifestParsed);
        this.hls.off(HlsJs.Events.ERROR, this.onError);
        this.hls.destroy();
        this.hls = null;
    }

    public getMediaStreamDeliveryType() {
        return MediaStreamDeliveryType.ADAPTIVE_VIA_MSE;
    }

    public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
        // TODO
    }

    private onManifestParsed = () => {
        this.emit('levels', this.getMediaLevels())
    }

    private onError = (type, errorEvent) => {
        if (errorEvent && (errorEvent.details === 'manifestParsingError' || errorEvent.details === 'manifestLoadError')) {
            this.emit('error', Errors.SRC_LOAD_ERROR, this.mediaStream && this.mediaStream.url, errorEvent);
        }
    }

    private getMediaLevels(): MediaLevel[] {
        if (!this.hls.levels || !this.hls.levels.length) {
            return [];
        }

        const levels = this.hls.levels as HlsJsLevel[];
        return levels.map(level => {
            return { bitrate: level.bitrate, width: level.width, height: level.height };
        })
    }

    public static isSupported(env: EnvironmentSupport): boolean {
        return env.MSE && HlsJs.isSupported();
    };

    public static canPlay(mediaType: string): boolean {
        return mediaType === MediaStreamTypes.HLS;
    }
}
