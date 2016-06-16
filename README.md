# videoholic

Adaptive HTML5-based video playback abstraction library.

## What?

***videoholic*** simplifies playback of
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
All one has to do is provide *videoholic* with a `<video>` node and a `src`.

*Note:* When a browser natively supports a delivery format, the native implementation is preferred.

## Features:
- HLS and MPEG-DASH playback capabilities in browsers without native support.
- Automatically sets and cleans up helper libraries on demand.
- Allows ingestion of custom sources by registering a compatible `SourceHandler`.
- Abstracts delivery formats by defining a simple `StreamHandler` interface with lifecycle methods.
- Normalizes video events to make them useful for player UI development.
- Minimal number of dependencies. 

## API

TODO: write this section.

## Development:
The project is set up using the following tools: TypeScript, npm, webpack, mocha, and chai.

To get dev mode running, use the following commands:
```Bash
git clone git@github.com:wix/wix-media-platform-videoholic.git videoholic
cd videoholic
npm install
npm start
```
Then browse to: [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server)

### Common commands
`npm build` - build using TypeScript

`npm minify` - bundle and minify using webpack

`npm start` - start webpack-dev-server

`npm test` - run tests, builds project first