import {expect} from 'chai';
import {renderDemo} from '../examples/example';
import {envSupports} from '../src/utils/environment-detection';

describe('Vidi E2E', function () {
    this.timeout(5000); // 5 seconds

    beforeEach(function () {
        this.stageRoot = renderDemo();
    });

    afterEach(function () {
        document.body.removeChild(this.stageRoot);
    });

    const formatsToTest = [];
    if (envSupports.MP4) {
        formatsToTest.push('MP4')
    }

    if (envSupports.WEBM) {
        formatsToTest.push('WEBM');
    }

    if (envSupports.HLS || envSupports.MSE) {
        formatsToTest.push('HLS');
    }

    if (envSupports.DASH || envSupports.MSE) {
        formatsToTest.push('DASH');
    }

    formatsToTest.forEach(format => {
        it(`allows playback of ${format}, if possible`, function (done) {
            const videoElement = document.getElementById('nativeVideo');

            videoElement.addEventListener('canplay', () => {
                done();
            });

            document.getElementById(format).click();
        });
    });
});
