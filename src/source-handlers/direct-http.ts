import {MediaSource, MediaSourceHandler, MediaStream, MediaStreamType} from '../types';
import {getExtFromUrl} from '../utils';

const extensionsMap = {
    mp4: MediaStreamType.MP4,
    webm: MediaStreamType.WEBM,
    m3u8: MediaStreamType.HLS,
    mpd: MediaStreamType.DASH
}

/**
 * Handles direct URLs to video assets, such as:
 * http://www.some-url.com/some_video.mp4
 */
export class DirectHTTPHandler implements MediaSourceHandler {
    canHandleSource(src: MediaSource): boolean {
        if (typeof src !== "string") {
            return false;
        }
        const ext = getExtFromUrl(src)
        if (extensionsMap[ext] !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    getMediaStream(src: MediaSource): MediaStream {
        return { url: src, type: extensionsMap[getExtFromUrl(src)] };
    }
}
