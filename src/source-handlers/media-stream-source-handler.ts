import {MediaSource, MediaSourceHandler, MediaStream, MediaStreamTypes} from '../types';

/**
 * Handles [[MediaStream]] objects as sources.
 * 
 * When this handler is registered, the user can specify the *type* of stream.
 * This allows playback of URLs that don't end with a known media file extensions (e.g. friendly URLs).
 * [[Vidi]] matches the explicit type to an appropriate [[MediaStreamHandler]].
 * 
 * Example:
 * ```ts
 * // Explicitly specifying HLS as the stream type.
 * vidi.src = { url: 'http://some-url/stream-without-extension', type: Vidi.MediaStreamTypes.HLS}
 * ```
 */
export class MediaStreamSourceHandler implements MediaSourceHandler {
    canHandleSource(src: MediaSource): boolean {
        return (src !== null && typeof src === 'object' && src.url !== undefined && src.type !== undefined);
    }

    getMediaStreams(src: MediaSource): MediaStream[] {
        return [src];
    }
}
