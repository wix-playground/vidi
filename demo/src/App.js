import React, { Component } from 'react';
import Vidi from 'vidi';
import bigBuckBunny from './images/big-buck-bunny.jpg';
import sintel from './images/sintel.jpg';
import tearsOfSteel from './images/tears-of-steel.jpg';
import './App.css';

export class App extends Component {
    state = { format: 'Auto', sourceUrl: '', dropdownOpen: false, levels: [], currentLevel: -1 };
    vidi = new Vidi();

    constructor(props) {
        super(props);
        this.vidi.on('levels', levels => {
            this.setState({ levels });
        });
        this.vidi.on('levelchange', currentLevel => {
            this.setState({ currentLevel });
        });
    }

    setFormat(format) {
        this.setState({ format, dropdownOpen: false });
    }

    play = () => {
        switch (this.state.format) {
            case 'Hls':
                this.vidi.src = { type: Vidi.MediaStreamTypes.HLS, url: this.state.sourceUrl };
                break;
            case 'Dash':
                this.vidi.src = { type: Vidi.MediaStreamTypes.DASH, url: this.state.sourceUrl };
                break;
            case 'Mp4':
                this.vidi.src = { type: Vidi.MediaStreamTypes.MP4, url: this.state.sourceUrl };
                break;
            case 'WebM':
                this.vidi.src = { type: Vidi.MediaStreamTypes.WEBM, url: this.state.sourceUrl };
                break;
            default:
                this.vidi.src = this.state.sourceUrl;
                break;
        }
        this.vidi.play();
    }

    handleVideoRef = (videoElement) => {
        this.vidi.setVideoElement(videoElement);
    }

    turnOffTextTracks = ({ target: videoElement }) => {
        for (let i = 0; i < videoElement.textTracks.length; ++i) {
            videoElement.textTracks[i].mode = 'hidden';
        }
    }

    render() {
        const dropdownContent = !this.state.dropdownOpen ? null :
            <div className="dropdown-content">
                <div onClick={() => this.setFormat('Auto')}>Auto</div>
                <div onClick={() => this.setFormat('Hls')}>Hls</div>
                <div onClick={() => this.setFormat('Dash')}>Dash</div>
                <div onClick={() => this.setFormat('Mp4')}>Mp4</div>
                <div onClick={() => this.setFormat('WebM')}>WebM</div>
            </div>;

        return (
            <div className="App">
                <div className="content">
                    <h1 className="vidi">vidi</h1>
                    <h2><code className="code">&lt;video&gt;</code> <span className="tagLine">playback simplified</span></h2>
                    <video className="video" key="video" controls ref={this.handleVideoRef} />
                    <div className="formWrapper">
                        <label htmlFor="sourceInput" className="urlLabel">URL: </label>
                        <input type="text" id="sourceInput" onChange={e => this.setState({ sourceUrl: e.target.value })} value={this.state.sourceUrl} />
                        <div className="dropdown" onClick={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })} onMouseEnter={() => this.setState({ dropdownOpen: true })} onMouseLeave={() => this.setState({ dropdownOpen: false })}>
                            <div className="btn dropbtn">{this.state.format}</div>
                            {dropdownContent}
                        </div>
                        <span className="btn playBtn" onClick={this.play}>Play</span>
                    </div>
                    {
                        (this.state.levels.length > 0) ?
                            <div className="levels">
                                <h3>Media Levels:</h3>
                                <ol>
                                    {this.state.levels.map((level, idx) => {
                                        const props = { className: 'level', onClick: () => this.vidi.setMediaLevel(idx) };
                                        if (idx === this.state.currentLevel) {
                                            props.className += ' bold';
                                        }
                                        return <li {...props}>{level.width || -1}x{level.height || -1} - {level.name || 'Unknown'} - {(level.bitrate || 0) / 1000}kbps</li>
                                    })}
                                </ol>
                            </div>
                            : null
                    }
                    <div className="boxes">
                        <div className="box" onClick={() => this.setState({
                            sourceUrl: 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'
                        })}>
                            <img src={bigBuckBunny} title="Big Buck Bunny via HLS" alt="Big Buck Bunny" />
                        </div>
                        <div className="box centerBox" onClick={() => this.setState({
                            sourceUrl: 'http://bitdash-a.akamaihd.net/content/sintel/sintel.mpd'
                        })}>
                            <img src={sintel} title="Sintel via MPEG-DASH" alt="Sintel" />
                        </div>
                        <div className="box">
                            <img src={tearsOfSteel} title="Tears of Steel - source URL is needed" alt="Tears of Steel" />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
