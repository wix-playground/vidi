import {MediaSource, MediaSourceHandler, MediaStream, MediaStreamTypes} from '../types';
import {getExtFromUrl} from '../utils';

const extensionsMap = Object.create(null);

extensionsMap.mp4 = MediaStreamTypes.MP4;
extensionsMap.webm = MediaStreamTypes.WEBM;
extensionsMap.m3u8 = MediaStreamTypes.HLS;
extensionsMap.mpd = MediaStreamTypes.DASH;

/**
 * Handles direct URLs to video assets, such as:
 * http://domain.name/some_video.mp4
 * http://domain.name/some_video.webm
 * http://domain.name/hls_playlist.m3u8
 * http://domain.name/dash_playlist.mpd
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
