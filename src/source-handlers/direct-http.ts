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
 * http://domain.name/some_video.mp4
 * http://domain.name/some_video.webm
 * http://domain.name/hls_playlist.m3u8
 * http://domain.name/dash_playlist.mpd
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
