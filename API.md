TODO: Write this document.
```js
import Videoholic from 'videoholic';

const video = document.createElement('video');
const videoholic = new Videoholic(video);

videoholic.setSrc('http://www.my-url.com/some_video.mp4');

videoholic.on('statuschange', callback);
videoholic.on('durationchange', callback);

videoholic.play();
videoholic.pause();
```
