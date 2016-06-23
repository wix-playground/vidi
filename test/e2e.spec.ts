import {expect} from 'chai';
import {renderDemo} from '../examples/example';

describe('Vidi E2E', function () {
    beforeEach(function () {
        this.stageRoot = renderDemo();
    });

    afterEach(function () {
        document.body.removeChild(this.stageRoot);
    });

    const formatsToTest = ['mp4', 'webm', 'hls', 'dash'];

    formatsToTest.forEach(format => {
        it(`allows playback of ${format}`, function (done) {
            const videoElement = document.getElementById('nativeVideo');

            videoElement.addEventListener('loadstart', function durationChange() {
                done();
            });

            document.getElementById(format).click();
        });
    });
});
