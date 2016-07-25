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
export type MediaSource = string | MediaStream;
