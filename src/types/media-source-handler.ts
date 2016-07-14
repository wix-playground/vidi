import {MediaStream} from './media-stream';

/**
 * A media source for vidi.
 * This can be *anything* (`string`, `object`, etc.) as long as 
 * there is a matching registered [[MediaSourceHandler]] that can handle it.
 * 
 * For example:
 * - [[URLSourceHandler]] for `string` URLs.
 * - [[MediaStreamSourceHandler]] for `object`s implementing the [[MediaStream]] interface.
 */
export type MediaSource = any;

export interface MediaSourceHandler {
    /**
     * Whether it can handle a provided [[MediaSource]].
     * 
     * @param src a [[MediaSource]] to check.
     * @returns `true` if the `src` can be handled. `false`, otherwise.
     */
    canHandleSource(src: MediaSource): boolean;

    /**
     * Parses [[MediaSource]] and returns all [[MediaStream]] objects it can generate from it.
     * 
     * @returns an array of generated [[MediaStream]] objects.
     */
    getMediaStreams(src: MediaSource): MediaStream[];
}