import {EnvironmentSupport} from '../types';

/**
 * `true` if we are running inside a web browser, `false` otherwise (e.g. running inside Node.js). 
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * This is a map which lists native support of formats and APIs.
 * It gets filled during runtime with the relevant values to the current environment.
 */
export const NativeEnvironmentSupport: EnvironmentSupport = {
    MSE: false,
    HLS: false,
    DASH: false,
    MP4: false,
    WEBM: false
}

function detectEnvironment() {
    if (!isBrowser) {
        return;
    }
    NativeEnvironmentSupport.MSE = ('WebKitMediaSource' in window) || ('MediaSource' in window);

    const video = document.createElement('video');
    if (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL')) {
        NativeEnvironmentSupport.HLS = true;
    }

    if (video.canPlayType('application/dash+xml')) {
        NativeEnvironmentSupport.DASH = true;
    }

    if (video.canPlayType('video/mp4')) {
        NativeEnvironmentSupport.MP4 = true;
    }

    if (video.canPlayType('video/webm')) {
        NativeEnvironmentSupport.WEBM = true;
    }
}

detectEnvironment(); // Run once
