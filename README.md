# vidi - `<video>` playback simplified.
[![npm](https://img.shields.io/npm/v/vidi.svg)](https://www.npmjs.com/package/vidi)
[![Build Status](https://travis-ci.org/wix/vidi.svg?branch=master)](https://travis-ci.org/wix/vidi)
[![dependencies Status](https://david-dm.org/wix/vidi/status.svg)](https://david-dm.org/wix/vidi)
[![devDependencies Status](https://david-dm.org/wix/vidi/dev-status.svg)](https://david-dm.org/wix/vidi?type=dev)

The browser world is highly fragmented, and browser vendors all have their own preferences and priorities regarding video encoding standards and adaptive streaming methods. This results in a lack of compatiblity between browsers, with each browser supporting some methods while providing no support for other methods.

***vidi*** makes it easy dealing with otherwise complex `<video>` playback scenarios.

## How does *vidi* help?

* Automatically picks a playback format based on the current browser's capabilities.
* Provides seamless playback of [adaptive content](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming), even when native support is not available, by leveraging [MSE](https://en.wikipedia.org/wiki/Media_Source_Extensions)-based libraries.
* Normalizes and simplifies `<video>` events so that callbacks receive relevant information per the event type.

## Compatible web browsers

* Chrome (tested with v51.0.2704.84)
* Firefox (tested with v47.0)
* Internet Explorer 11 (tested on Windows 10)
* Safari (tested with 9)

## Getting started

### Installation

***vidi*** is currently only available via npm. At the root folder of the project run:

```bash
npm install vidi --save
```

### Usage

We begin by importing ***vidi*** into our module, and initializing it.

If you're using ES6:

```ts
import {Vidi} from 'vidi';
```
Otherwise:

```js
const Vidi = require('vidi').Vidi;
```

Then get the `<video>` element from the document, and create a ***Vidi*** instance:

```ts
// Assuming there is a <video> element in the document with id 'my-video-element'.
const videoElement = document.getElementById('my-video-element');

// Create a new Vidi instance, providing it the <video> element
const vidi = new Vidi(videoElement);
```

Set the source of the video stream:

```ts
vidi.src = 'http://my-url/video.mp4';
```

The type of stream is automatically detected from the URL. The following extensions are recognized: `.mp4` (MP4), `.webm` (WebM), `.m3u8` (HLS manifest), and `.mpd` (DASH manifest).

If the URL does not end with the file extension, the type can be specified explicitly:

```ts
vidi.src = { url: 'http://my-url/video-source', type: Vidi.MediaStreamTypes.HLS };
```

After a `<video>` and a `src` are provided, we have a working HTML5 media playback of all the [supported source formats](FORMATS.md).

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
The logic uses the following prioritization system to pick the most suitable format (*from highest priority to lowest*):

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
| error          | See [Error Handling](#error-handling) section below.                    |

The main ***Vidi*** extends [EventEmitter3](https://github.com/primus/eventemitter3),
so any method from that class can be used on ***vidi***'s instances.

For example, subscribing to events can be done using the `.on()` method:
```ts
vidi.on('durationchange', function (newDuration) {
    console.log('New duration of video: ' + newDuration);
});
```

To unsubscribe a listener:

```ts
vidi.off('durationchange', durationChangeHandler);
```

### Error Handling
> Work in progress!

***vidi*** aligns the different error codes in each possible playback flow
into a single system.

Error codes are available on the main ***Vidi*** class:
```ts
Vidi.Errors.SRC_LOAD_ERROR // for src load failures in all flows

// More to come soon...
```
Listening for errors is done just like other events:
```ts
vidi.on('error', function(errorCode, url, originalEvent) {
    if (errorCode === Vidi.Errors.SRC_LOAD_ERROR) {
        // couldn't load src. url is provided as a second parameter
        // show a friendly message (or switch to a placeholder?)
    }
});
```

### Adaptive playback via MSE-based libraries

When native browser support for adaptive content is not available,
***vidi*** uses MSE-based libraries
([dash.js](https://github.com/Dash-Industry-Forum/dash.js/) and 
[hls.js](https://github.com/dailymotion/hls.js)) to allow seamless playback of MPEG-DASH and HLS
media streams.

***vidi*** normalizes the different APIs of each library into a single coherent interface,
while also allowing for basic customization.

Initially preferred bitrate for adaptive sources can be configured
per ***Vidi*** instance, via the `setInitialBitrate` method:

```ts
vidi.setInitialBitrate(3000); // 3000kbps
vidi.src = '...';
```

### Media Levels
> Work in progress!

***vidi*** exposes two events which fire when a new adaptive source is played. 

The `levels` event provides an array of `MediaLevel`s, each representing
a sub-streams in the adaptive source.
```ts
interface MediaLevel {
    width?: number;
    height?: number;
    bitrate?: number;
    name?: string;
}

vidi.on('levels', function (levels: MediaLevels[]) {
    // map the information to a GUI quality selector...
});
```


In addition, the `currentLevel` event is fired when playback switches to a new level:
```ts
vidi.on('currentLevel', function (levelIdx: number) {
    // highlight the current level in the GUI quality selector
});
```

### Pseudo-adaptive:
> Work in progress!

When two or more sources point to the same format,
they are treated as different `MediaLevel`s instead of separate sources.
Same API as adaptive sources.

```ts
vidi.src = [
    { url: 'http://my-url/low_quality.mp4', type: Vidi.MediaStreamTypes.MP4, name: '480p' },    //    |---
    { url: 'http://my-url/medium_quality.mp4', type: Vidi.MediaStreamTypes.MP4, name: '720p' }, //  <=|    These three will be grouped by Vidi
    { url: 'http://my-url/high_quality.mp4', type: Vidi.MediaStreamTypes.MP4, name: '1080p' },  //    |---
    { url: 'http://my-url/adaptive-stream.m3u8', type: Vidi.MediaStreamTypes.HLS },
];
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

`npm run mediaserver` - starts a local http media server (see the `http-media-server` folder)

## License

We use a custom license, see [LICENSE.md](LICENSE.md).
