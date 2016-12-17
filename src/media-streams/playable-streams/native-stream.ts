import {MediaStream, PlayableStream, EnvironmentSupport, EmitEventsFn, MediaStreamDeliveryType, PlayableStreamCreator} from '../../types';

export function getNativeStreamCreator(streamType: string, deliveryType: MediaStreamDeliveryType): PlayableStreamCreator {
    class NativeStream implements PlayableStream {
        private currentLevel: number = 0;

        constructor(private mediaStreams: MediaStream[], private emit: EmitEventsFn) {
        }

        public attach(videoElement: HTMLVideoElement): void {
            videoElement.src = this.mediaStreams[this.currentLevel].url;
            this.emit('levels', this.mediaStreams.map(mediaStream => {
                return { name: mediaStream.name || mediaStream.url };
            }));
            this.emit('levelchange', this.currentLevel);
        }

        public detach(videoElement: HTMLVideoElement) {
            videoElement.src = '';
        }

        public getMediaStreamDeliveryType() {
            return deliveryType;
        }

        public static isSupported(env: EnvironmentSupport): boolean {
            return env[streamType];
        };

        public static canPlay(mediaType: string): boolean {
            return mediaType === streamType;
        }

        public setMediaLevel(newLevel: number, videoElement: HTMLVideoElement) {
            if (newLevel < this.mediaStreams.length) {
                this.currentLevel = newLevel;
                const timeBeforeSwitch = videoElement.currentTime;
                videoElement.src = this.mediaStreams[this.currentLevel].url;
                videoElement.currentTime = timeBeforeSwitch;
                this.emit('levelchange', this.currentLevel);
            }
        }
    }

    return NativeStream;
}
