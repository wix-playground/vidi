export enum PlaybackStatus {
	PAUSED,
	PAUSED_BUFFERING,
	PLAYING,
	PLAYING_BUFFERING,
	ENDED
}

export interface PlaybackState {
    duration: number;
    currentTime: number;
    status: PlaybackStatus;
    playbackRate: number;
    volume: number;
    muted: boolean;
}

export const defaultPlaybackState: PlaybackState = {
    duration: 0,
    currentTime: 0,
    status: PlaybackStatus.PAUSED,
    playbackRate: 1,
    volume: 1,
    muted: false
}
