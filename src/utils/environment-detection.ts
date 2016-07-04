export const isBrowser = typeof window !== 'undefined';

/**
 * This is a map which lists native support of formats and APIs.
 * It gets filled during runtime with the relevant values to the current environment.
 */
export const envSupports = {
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
    envSupports.MSE = ('WebKitMediaSource' in window) || ('MediaSource' in window);

    const video = document.createElement('video');
    if (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL')) {
        envSupports.HLS = true;
    }

    if (video.canPlayType('application/dash+xml')) {
        envSupports.DASH = true;
    }

    if (video.canPlayType('video/mp4')) {
        envSupports.MP4 = true;
    }

    if (video.canPlayType('video/webm')) {
        envSupports.WEBM = true;
    }
}

detectEnvironment();
