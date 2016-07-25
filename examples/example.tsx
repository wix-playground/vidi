import Vidi from '../src';
import React = require('react');
import ReactDOM = require('react-dom');

const root = document.createElement('div');
export function renderDemo(): HTMLElement {
    document.body.appendChild(root);

    const testStreams = {
        HLS: 'http://localhost:3000/sample.m3u8',
        // DASH: 'http://localhost:3000/sample.mpd',
        DASH: 'http://bitdash-a.akamaihd.net/content/sintel/sintel.mpd',
        MP4: 'http://localhost:3000/sample.mp4',
        WEBM: 'http://localhost:3000/sample.webm',
        COMPLEX: [{ url: 'http://media.wixapps.net/ggl-105826725040924916100/video/1d336a477eae470a8c7d86f59420aa80/480p/mp4/file.mp4', type: 'MP4', name: '480p' },
            'http://media.wixapps.net/ggl-105826725040924916100/video/1d336a477eae470a8c7d86f59420aa80/720p/mp4/file.mp4',
            'http://media.wixapps.net/ggl-105826725040924916100/video/1d336a477eae470a8c7d86f59420aa80/1080p/mp4/file.mp4',
            'http://bitdash-a.akamaihd.net/content/sintel/sintel.mpd',
            'http://media.wixapps.net/ggl-105826725040924916100/video/1d336a477eae470a8c7d86f59420aa80/480p/webm/file.webm',
            'http://media.wixapps.net/ggl-105826725040924916100/video/1d336a477eae470a8c7d86f59420aa80/720p/webm/file.webm',
            'http://media.wixapps.net/ggl-105826725040924916100/video/1d336a477eae470a8c7d86f59420aa80/1080p/webm/file.webm']
    }

    const videoStyle = { width: 640, height: 360, background: 'black' }

    class Example extends React.Component<any, any> {
        vidi: Vidi = new Vidi();

        constructor(props) {
            super(props);
        }

        changeURL(newUrl) {
            this.vidi.src = newUrl;
        }

        render() {
            return (<div>
                <button id="HLS" onClick={() => this.changeURL(testStreams.HLS) }>HLS</button>
                <button id="DASH" onClick={() => this.changeURL(testStreams.DASH) }>DASH</button>
                <button id="MP4" onClick={() => this.changeURL(testStreams.MP4) }>MP4</button>
                <button id="WEBM" onClick={() => this.changeURL(testStreams.WEBM) }>WEBM</button>
                <button id="COMPLEX" onClick={() => this.changeURL(testStreams.COMPLEX) }>COMPLEX</button>
                <input type="text" id="customurl" />
                <button id="custom" onClick={() => this.changeURL((document.getElementById('customurl') as HTMLInputElement).value) }>Custom</button>
                <br /><br />
                <video key="video" id="nativeVideo" style={videoStyle} controls ref={v => this.vidi.setVideoElement(v) }></video>
            </div>)
        }
    }

    ReactDOM.render(<Example />, root);

    return root;
}
