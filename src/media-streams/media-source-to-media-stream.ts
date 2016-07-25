import {MediaStream, MediaStreamTypes, MediaSource} from '../types';
import {getExtFromUrl, isString} from '../utils';

const extensionsMap = Object.create(null);

extensionsMap.mp4 = MediaStreamTypes.MP4;
extensionsMap.webm = MediaStreamTypes.WEBM;
extensionsMap.m3u8 = MediaStreamTypes.HLS;
extensionsMap.mpd = MediaStreamTypes.DASH;

export function mediaSourceToMediaStream(src: MediaSource): MediaStream {
    if (!isString(src)) {
        // If not string, assume we received a MediaStream object
        return src as MediaStream;
    }

    const streamType = extensionsMap[getExtFromUrl(src as string)];
    if (!streamType) {
        throw new Error(`Vidi: cannot auto-detect url '${src}'. Please specify type manually using the MediaStream interface.`);
    } else {
        return { url: src as string, type: streamType };
    }
}
