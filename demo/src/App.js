import React, { Component } from 'react';
import Vidi from 'vidi';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { format: 'Auto', sourceUrl: '', dropdownOpen: false };
    this.vidi = new Vidi();
    this.play = this.play.bind(this);
    this.handleVideoRef = this.handleVideoRef.bind(this);
  }

  setFormat(format) {
    this.setState({ format, dropdownOpen: false });
  }

  play() {
    switch (this.state.format) {
      case 'Hls':
        this.vidi.src = {type: Vidi.MediaStreamTypes.HLS, url: this.state.sourceUrl};
        break;
      case 'Dash':
        this.vidi.src = {type: Vidi.MediaStreamTypes.DASH, url: this.state.sourceUrl};
        break;
      case 'Mp4':
        this.vidi.src = {type: Vidi.MediaStreamTypes.MP4, url: this.state.sourceUrl};
        break;
      case 'WebM':
        this.vidi.src = {type: Vidi.MediaStreamTypes.WEBM, url: this.state.sourceUrl};
        break;
      default:
        this.vidi.src = this.state.sourceUrl;
        break;
    }
    this.vidi.pause();
    this.vidi.play();
  }

  handleVideoRef(videoElement) {
    this.vidi.setVideoElement(videoElement);
  }

  render() {

    const dropdownContent = !this.state.dropdownOpen ? null :
      <div className="dropdown-content">
        <div onClick={() => this.setFormat('Auto') }>Auto</div>
        <div onClick={() => this.setFormat('Hls') }>Hls</div>
        <div onClick={() => this.setFormat('Dash') }>Dash</div>
        <div onClick={() => this.setFormat('Mp4') }>Mp4</div>
        <div onClick={() => this.setFormat('WebM') }>WebM</div>
      </div>;

    return (
      <div className="App">
        <div className="content">
          <h1 className="vidi">vidi</h1>
          <h2><code className="code">&lt; video&gt; </code> <span className="tagLine">playback simplified</span></h2>
          <video className="video" key="video" controls ref={this.handleVideoRef} />
          <div className="formWrapper">
            <label htmlFor="sourceInput" className="urlLabel">URL: </label>
            <input type="text" id="sourceInput" onChange={e => this.setState({ sourceUrl: e.target.value }) } value={this.state.sourceUrl} />
            <div className="dropdown" onClick={() => this.setState({ dropdownOpen: !this.state.dropdownOpen }) } onMouseEnter={() => this.setState({ dropdownOpen: true }) } onMouseLeave={() => this.setState({ dropdownOpen: false }) }>
              <div className="btn dropbtn">{this.state.format}</div>
              {dropdownContent}
            </div>
            <span className="btn playBtn" onClick={this.play}>Play</span>
          </div>
          <div className="boxes">
            <div className="box" onClick={() => this.setState({ sourceUrl: 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8' }) }>
              <img src="https://i.imgsafe.org/7a0b5b81d6.jpg" alt="" />
            </div>
            <div className="box centerBox" onClick={() => this.setState({ sourceUrl: 'http://bitdash-a.akamaihd.net/content/sintel/sintel.mpd' }) }>
              <img src="https://i.imgsafe.org/7a0bd2f0e6.jpg" alt="" />
            </div>
            <div className="box">
              <img src="https://i.imgsafe.org/7a0b82a91a.jpg" title="Play Movie Name" alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
