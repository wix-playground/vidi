import {MediaStream, MediaStreamTypes, MediaSource} from '../types';

const extensionsMap = Object.create(null);

extensionsMap.mp4 = MediaStreamTypes.MP4;
extensionsMap.webm = MediaStreamTypes.WEBM;
extensionsMap.m3u8 = MediaStreamTypes.HLS;
extensionsMap.mpd = MediaStreamTypes.DASH;

const anchorElement = document.createElement('a');

export function detectStreamType(url: string): string {
    anchorElement.href = url;
    const streamType = extensionsMap[getExtFromPath(anchorElement.pathname)];
    if (!streamType) {
        throw new Error(`Vidi: cannot auto-detect url '${url}'. Please specify type manually using the MediaStream interface.`);
    } else {
        return streamType;
    }
}

export function getExtFromPath(path: string): string {
    return path.split('.').pop();
}
