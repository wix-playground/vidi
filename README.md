# vidi - `<video>` playback simplified.

***vidi*** makes it easy dealing with otherwise complex `<video>` playback scenarios.

## Features
- Accepts multiple MP4, WebM, HLS, and MPEG-DASH sources.
- Automatically picks a playback format based on the current browser's capabilities.
- Integrates libraries such as such as 
[hls.js](https://github.com/dailymotion/hls.js) and
 [dash.js](https://github.com/Dash-Industry-Forum/dash.js/)
 for seamless playback of [adaptive content](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming)
 via [MSE](https://en.wikipedia.org/wiki/Media_Source_Extensions) (when native support isn't available).
- Normalizes `<video>` events so that callbacks receive relevant information per the event type.
- Minimal number of dependencies. 

## Getting started

### Installation
***vidi*** is currently only available via npm:
```bash
$ npm install vidi --save
```

### Usage
We begin by importing ***vidi*** into our module, and initiallizing it:
```ts
import {Vidi} from 'vidi';
// or, if you aren't using ES6 modules:
// const Vidi = require('vidi).Vidi;

// Assuming there is a <video> element in the document with id 'my-video-element'.
const videoElement = document.getElementById('my-video-element');

// Create a new Vidi instance, providing it the <video>
const vidi = new Vidi(videoElement);
```

A source can then be set:
```ts
// Type of stream is automatically detected from the URL
vidi.src = 'http://my-url/video.mp4';
vidi.src = 'http://my-url/video.webm';
vidi.src = 'http://my-url/video.m3u8';
vidi.src = 'http://my-url/video.mpd';

// And can also be specified explicitly
vidi.src = { url: 'http://my-url/video-source', type: Vidi.MediaStreamTypes.HLS };
```

At this point, we have a working HTML5 `<video>` playback of all the [supported source formats](FORMATS.md).

### *And now, the real magic occurs...*

Multiple sources (of different formats) can be provided as an array:
```ts
vidi.src = [
  'http://my-url/video.mp4',
  'http://my-url/video.webm',
  'http://my-url/video.m3u8'
];
```
Types can still be specified explicitly (for all or some of the sources):
```ts
vidi.src = [
  'http://my-url/video.mp4',
  { url: 'http://my-url/video.webm', type: Vidi.MediaStreamTypes.WEBM },
  'http://my-url/video.m3u8'
];
```
***vidi*** assumes the URLs point to **different formats** of the **same video**,
and will automatically detect and choose the ideal format for the current browser.

The order of sources in the array doesn't matter.
The logic uses the following prioritization system to pick the most suitable format
(*from highest priority to lowest*):

1. **Adaptive sources** that can be played via **native** browser support. *Example: HLS on Safari* 
2. **Adaptive sources** that can be played via **MSE**-based libraries. *Example: DASH on Chrome*
3. **Progressive** sources (MP4 and WebM) that can be played via **native** browser support.

The algorithm bases decisions using browser feature detection.

### Events
***vidi*** provides an easy to use event system.
Listeners (callbacks) receive relevant data, per event type,
as the first parameter.

It also normalizes several "status" changing native events
(*play, playing, pause, seeking, seeked, and ended*)
into a single `statuschange` event.

The following events can be listened to:

| Event Type     | `<video>` info sent to the listener                                     |
|----------------|-------------------------------------------------------------------------|
| statuschange   | `PlaybackStatus` value. One of:<ul><li>`vidi.PlaybackStatus.PLAYING`</li><li>`vidi.PlaybackStatus.PAUSED`</li><li>`vidi.PlaybackStatus.ENDED`</li><li>`vidi.PlaybackStatus.PLAYING_BUFFERING`</li><li>`vidi.PlaybackStatus.PAUSED_BUFFERING`</li></ul> |
| durationchange | Duration (in milliseconds)                                              |
| timeupdate     | Current time (in milliseconds)                                          |
| ratechange     | Playback rate (*0 to 1, where 1 is full-speed, 0.5 is half-speed, etc*) |
| volumechange   | An object containing `volume` and `muted` keys                          |
| loadstart      | `PlaybackState` object containing all data above combined               |
| error          | The error which occurred                                                |

Subscribing to events can be done using the `.on()` or `.once()` methods:
```ts
// Callback will be called on every durationchange event
vidi.on('durationchange', function (newDuration) {
    console.log('New duration of video: ' + newDuration);
});

// Callback will be called only once (for the first error event)
vidi.once('error', function (errorData) {
    console.error('All hell broke loose!', errorData);
});
```

To un-subscribe a listener:
```ts
vidi.off('durationchange', durationChangeHandler);
```

### Advanced features

> Work in progress!

#### Pseudo-adpative:

```ts
// When two or more sources point to the same format,
// they are being treated as different MediaLevels instead of separate sources.
// Same API as adaptive sources.
vidi.src = [
    { url: 'http://my-url/low_quality.mp4', type: Vidi.MediaStreamTypes.MP4, name: '480p' },    //    |---
    { url: 'http://my-url/medium_quality.mp4', type: Vidi.MediaStreamTypes.MP4, name: '720p' }, //  <=|    These three will be grouped by Vidi
    { url: 'http://my-url/high_quality.mp4', type: Vidi.MediaStreamTypes.MP4, name: '1080p' },  //    |---
    { url: 'http://my-url/adaptive-stream.m3u8', type: Vidi.MediaStreamTypes.HLS },
];
```
#### MediaLevels

```ts
vidi.on('levels', function (levels: MediaLevels[]) {
    // Listen to this event to know the current bitrates of an adaptive source  
});

vidi.on('currentLevel', function (level: number) {
    // When a new level is exposed 
}
```

## Development
The project is set up using the following tools: TypeScript, npm, webpack, mocha, and chai.

To get dev mode running, use the following commands:
```Bash
git clone git@github.com:wix/vidi.git
cd vidi
npm install
npm start
```
Then browse to: [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server)

### Common commands
`npm build` - build using TypeScript

`npm minify` - bundle and minify using webpack

`npm start` - start webpack-dev-server

`npm test` - run tests, builds project first

`npm run mediaserver` - starts a local http media server. see `http=media-server` folder.
