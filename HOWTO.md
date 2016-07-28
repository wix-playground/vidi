### Basic usage

```ts
// Play a single mp4 source:
vidi.src = 'http://my-url/video.mp4';

// Play a single webm source:
vidi.src = 'http://my-url/video.webm';

// Play a single HLS source:
vidi.src = 'http://my-url/video.m3u8';

// Play a single MPEG-DASH source:
vidi.src = 'http://my-url/video.mpd';

// Play a url without file extension by specifying type:
vidi.src = { url: 'http://my-url/video-source', type: Vidi.MediaStreamTypes.HLS };


// Several sources can be provided as an array:
vidi.src = [
  'http://my-url/video.mp4',
  'http://my-url/video.webm',
  'http://my-url/video.m3u8'
];

// And can also be mixed:
vidi.src = [
  'http://my-url/video.mp4',
  { url: 'http://my-url/video.webm', type: Vidi.MediaStreamTypes.WEBM },
  'http://my-url/video.m3u8'
];

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
### MediaLevels
```ts
vidi.on('levels', function (levels: MediaLevels[]) {
    // Listen to this event to know the current bitrates of an adaptive source  
});

vidi.on('currentLevel', function (level: number) {
    // When a new level is exposed 
}

```

### Native event handling
```ts
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
