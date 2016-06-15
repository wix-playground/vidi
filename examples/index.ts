import Videoholic from '../src';

const videoElement = document.createElement('video');
const videoholic = new Videoholic(videoElement)
videoElement.width = 960;
videoElement.height = 540;
videoElement.controls = true;
document.body.appendChild(videoElement);
videoholic.src = 'http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8';
// videoholic.src = 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8';
// videoholic.src = 'http://video-otfp.wixstatic.com/video/25a7a7_3da731e1ab66401a8c1c9f93a12b1093/1080p/mp4/file.m3u8';
