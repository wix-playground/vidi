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
```sh
$ npm install vidi --save
```

### Usage
We begin by importing ***vidi*** into our module, and initiallizing it:
```js
import {Vidi} from 'vidi';
// or, if you aren't using ES6 modules:
// const Vidi = require('vidi).Vidi;

// Assuming there is a <video> element in the document with id 'my-video-element'.
const videoElement = document.getElementById('my-video-element');

// Create a new Vidi instance, providing it the <video>
const vidi = new Vidi(videoElement);
```

A source can then be set:
```js
// Type of stream is automatically detected from the URL
vidi.src = 'http://my-url/video.mp4';
vidi.src = 'http://my-url/video.webm';
vidi.src = 'http://my-url/video.m3u8';
vidi.src = 'http://my-url/video.mpd';

// And can also be specified explicitly
vidi.src = { url: 'http://my-url/video-source', type: Vidi.MediaStreamTypes.HLS };
```

At this point, we have a working HTML5 `<video>` playback of all the supported source formats.

### *And now, the real magic occurs...*

Multiple sources (of different formats) can be provided as an array:
```js
vidi.src = [
  'http://my-url/video.mp4',
  'http://my-url/video.webm',
  'http://my-url/video.m3u8'
];
```
Types can still be specified explicitly:
```js
vidi.src = [
  'http://my-url/video.mp4',
  { url: 'http://my-url/video.webm', type: Vidi.MediaStreamTypes.WEBM },
  'http://my-url/video.m3u8'
];
```
***vidi*** assumes the URLs point to different formats of the same video.
It will automatically detect what can be played in the current browser
and choose the ideal format.

The order of sources in the array doesn't matter.
The logic uses the following prioritization system to pick the most suitable format
(*#1 has the highest priority, #2 has a lower one, etc...*):
1. **Adaptive sources** that can be played via **native** browser support. *Example: HLS on Safari* 
2. **Adaptive sources** that can be played via **MSE**-based libraries. *Example: DASH on Chrome*
3. **Progressive** sources (MP4 and WebM) that can be played via **native** browser support.

The algorithm bases decisions using browser feature detection.

### Events
```js
vidi.on('loadstart', function (playbackState: PlaybackState) { 

});

vidi.on('durationchange', function (newDuration: number) {

});

vidi.on('timeupdate', function (currentTime: number) {

});

vidi.on('ratechange', function (playbackRate: number) {

});

vidi.on('volumechange', function (volumeData: {volume: number, muted: boolean}){

});

vidi.on('statuschange', function (playbackStatus: PlaybackStatus) {

});

vidi.on('error', function (errorData) {
    
});
```

### Advanced features

#### Pseudo-adpative:

```js
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

## API

See [API Documentation](https://wix.github.io/vidi/docs/classes/vidi.html)

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
