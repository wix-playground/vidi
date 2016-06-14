TODO: Write this document.
```js
import Videoholic from 'videoholic';

const video = document.createElement('video');
const videoholic = new Videoholic(video);

videoholic.src = 'http://www.my-url.com/some_video.mp4';
videoholic.src = 'http://www.my-url.com/some_video.m3u8';

videoholic.on('statuschange', callback);
videoholic.on('durationchange', callback);

videoholic.play();
videoholic.pause();
```
