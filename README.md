# vidi

Adaptive HTML5-based video playback abstraction library.

## What?

***vidi*** simplifies playback of
[HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) and
[MPEG-DASH](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP)
video sources on today's web browsers.

Compatible web browsers:
* Chrome (tested with v51.0.2704.84)
* Firefox (tested with v47.0)
* Internet Explorer 11 (tested on Windows 10)
* Safari

## How?
A small engine makes use of libraries such as 
[hls.js](https://github.com/dailymotion/hls.js) and [dash.js](https://github.com/Dash-Industry-Forum/dash.js/)
and sets them up automatically when needed.<br>
All one has to do is provide *vidi* with a `<video>` node and a `src`.

*Note:* When a browser natively supports a delivery format, the native implementation is preferred.

## Features
- HLS and MPEG-DASH playback capabilities in browsers without native support.
- Automatically sets and cleans up helper libraries on demand.
- Allows ingestion of custom sources by registering a compatible `SourceHandler`.
- Abstracts delivery formats by defining a simple `StreamHandler` interface with lifecycle methods.
- Normalizes video events to make them useful for player UI development.
- Minimal number of dependencies. 

## Getting started

```js
import Vidi from 'vidi';

// Assuming there is a <video> element in the document with id 'my-video-element'.
const videoElement = document.getElementById('my-video-element');

// Create a new Vidi instance
const vidi = new Vidi(videoElement);

vidi.src = 'https://some-url.net/sample.m3u8';
// And that's it! vidi sets up everything for playback.
```

For more advanced usage examples, see [`HOWTO.md`](HOWTO.md).

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
