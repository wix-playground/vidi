const HlsJs = require('hls.js/lib');
import {
    MediaStream, PlayableStream, MediaStreamTypes, MediaLevel, EmitEventsFn,
    EnvironmentSupport, MediaStreamDeliveryType, Errors
} from '../../types';

interface HlsJsConfiguration {
    abrEwmaDefaultEstimate?: number;
    autoStartLoad?: boolean;
}

interface HlsJsLevel {
    bitrate: number;
    width: number;
    height: number;
    name: string;
}


export class HlsStream implements PlayableStream {
    private hls: any = null;
    private videoElement: HTMLVideoElement | null = null;
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
        this.videoElement = videoElement;

        const config: HlsJsConfiguration = { abrEwmaDefaultEstimate: initialBitrate * 1000 };

        if (videoElement.preload === 'none') {
            config.autoStartLoad = false;
            videoElement.addEventListener('play', this.attachOnPlay);
        }

        this.hls = new HlsJs(config);
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
        videoElement.removeEventListener('play', this.attachOnPlay);
        this.videoElement = null
    }

    public getMediaStreamDeliveryType() {
        return MediaStreamDeliveryType.ADAPTIVE_VIA_MSE;
    }

    public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
        // TODO
    }

    private attachOnPlay = () => {
        if (!this.videoElement) {
            return;
        }
        this.hls.startLoad();
        this.videoElement.removeEventListener('play', this.attachOnPlay);
    }

    private onManifestParsed = (
        eventType: string,
        { levels = [] as HlsJsLevel[], firstLevel = -1 }
    ) => {
        const mediaLevels: MediaLevel[] = levels.map(level => {
            return { bitrate: level.bitrate, width: level.width, height: level.height, name: level.name };
        })
        this.emit('levels', mediaLevels);
        if (firstLevel >= 0) {
            this.emit('currentLevel', firstLevel);
        }
    }

    private onError = (type, errorEvent) => {
        if (errorEvent && (errorEvent.details === 'manifestParsingError' || errorEvent.details === 'manifestLoadError')) {
            this.emit('error', Errors.SRC_LOAD_ERROR, this.mediaStream && this.mediaStream.url, errorEvent);
        }
    }

    public static isSupported(env: EnvironmentSupport): boolean {
        return env.MSE && HlsJs.isSupported();
    };

    public static canPlay(mediaType: string): boolean {
        return mediaType === MediaStreamTypes.HLS;
    }
}
