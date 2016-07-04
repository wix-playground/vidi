export enum PlaybackStatus {
    /**
     * Video is currently paused.
     */
	PAUSED,

    /**
     * Video is paused, but the player is buffering (for example, on seek when paused).
     */
	PAUSED_BUFFERING,

    /**
     * Video is playing.
     */
	PLAYING,

    /**
     * Video is trying to play, but is buffering.
     * This can happen due to a seek or an insufficient network connectivity speed.
     */
	PLAYING_BUFFERING,

    /**
     * Video has ended. Same as paused, but the playhead is at the end of the stream.  
     */
	ENDED
}

export interface PlaybackState {
    /**
     * The length of the media (in miliseconds).
     * 
     * *Value is >=0*
     */
    duration: number;

    /**
     * The time the playhead points to.
     * 
     * *Value is >=0*
     */
    currentTime: number;

    /**
     * The status of playback.
     */
    status: PlaybackStatus;

    /**
     * The playback rate.
     * 
     * *1 is normal, 0.5 is half speed, 2 is double-speed, etc.*
     */
    playbackRate: number;
    
    /**
     * The volume level.
     * 
     * *1 is 100%, 0 is 0%, 0.5 is 50%, etc.*
     */
    volume: number;

    /**
     * Whether the player is muted.
     */
    muted: boolean;
}

/**
 * An object that implements [[PlaybackState]] with UI-friendly defaults.
 */
export const defaultPlaybackState: PlaybackState = {
    duration: 0,
    currentTime: 0,
    status: PlaybackStatus.PAUSED,
    playbackRate: 1,
    volume: 1,
    muted: false
}
