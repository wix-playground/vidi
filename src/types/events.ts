import { EventEmitter } from 'eventemitter3';
import { MediaLevel } from './media-level';
import { Errors } from './errors';
import { PlaybackState, PlaybackStatus } from './playback-state';

export type LoadStartListener = (playbackState: PlaybackState) => void;
export type DurationListener = (newDuration: number) => void;
export type TimeUpdateListener = (currentTime: number) => void;
export type RateChangeListener = (playbackRate: number) => void;
export type VolumeChangeListener = (volumeState: { volume: number, muted: boolean }) => void;
export type StatusChangeListener = (playbackStatus: PlaybackStatus) => void;
export type ErrorListener = (code: Errors, url: string, originalEvent: any) => void;
export type LevelsListener = (levels: MediaLevel[]) => void;

export interface VidiEmitter {
    on(event: 'loadstart', fn: LoadStartListener, context?: any): this;
    on(event: 'durationchange', fn: DurationListener, context?: any): this;
    on(event: 'timeupdate', fn: TimeUpdateListener, context?: any): this;
    on(event: 'ratechange', fn: RateChangeListener, context?: any): this;
    on(event: 'volumechange', fn: VolumeChangeListener, context?: any): this;
    on(event: 'statuschange', fn: StatusChangeListener, context?: any): this;
    on(event: 'error', fn: ErrorListener, context?: any): this;
    on(event: 'levels', fn: LevelsListener, context?: any): this;
}

export class VidiEmitter extends EventEmitter implements VidiEmitter {
    // buffer class to override the type of on()
}