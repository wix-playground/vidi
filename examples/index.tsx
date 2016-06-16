import Videoholic from '../src';
import React = require('react');
import ReactDOM = require('react-dom');

const root = document.createElement('div');
document.body.appendChild(root);

const testStreams = {
    HLS: 'http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8',
    DASH: 'http://dash.edgesuite.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd',
    MP4: 'http://media.wixapps.net/ggl-105826725040924916100/video/1d336a477eae470a8c7d86f59420aa80/480p/mp4/file.mp4',
    WEBM: 'http://techslides.com/demos/sample-videos/small.webm'
}

interface State {
    currentUrl: string;
}

const videoStyle = { width: 960, height: 540, background: 'black' }

class Example extends React.Component<any, State> {
    videoholic: Videoholic = new Videoholic();

    componentDidMount() {
    }

    changeURL(newUrl: string) {
        this.videoholic.src = newUrl;
    }

    render() {
        return (<div><video style={videoStyle} controls ref={v => this.videoholic.setVideoElement(v) }></video>
            <br />
            <button onClick={() => this.changeURL(testStreams.HLS) }>HLS</button>
            <button onClick={() => this.changeURL(testStreams.DASH) }>DASH</button>
            <button onClick={() => this.changeURL(testStreams.MP4) }>MP4</button>
            <button onClick={() => this.changeURL(testStreams.WEBM) }>WEBM</button>
        </div>)
    }
}

ReactDOM.render(<Example />, root);
