import {MediaSource, MediaSourceHandler, MediaStream, MediaStreamTypes} from '../types';
import {getExtFromUrl} from '../utils';

const extensionsMap = Object.create(null);

extensionsMap.mp4 = MediaStreamTypes.MP4;
extensionsMap.webm = MediaStreamTypes.WEBM;
extensionsMap.m3u8 = MediaStreamTypes.HLS;
extensionsMap.mpd = MediaStreamTypes.DASH;

/**
 * Handles direct URLs to video assets with the following extensions:
 * - http://domain.name/some_video.mp4 *(MP4 media file)*
 * - http://domain.name/some_video.webm *(WebM media file)*
 * - http://domain.name/hls_playlist.m3u8 *(HLS playlist)*
 * - http://domain.name/dash_playlist.mpd *(DASH playlist)*
 */
export class URLSourceHandler implements MediaSourceHandler {
    canHandleSource(src: MediaSource): boolean {
        if (typeof src !== "string") {
            return false;
        }
        const ext = getExtFromUrl(src)
        return extensionsMap[ext] !== undefined;
    }

    getMediaStreams(src: MediaSource): MediaStream[] {
        return [{ url: src, type: extensionsMap[getExtFromUrl(src)] }];
    }
}
