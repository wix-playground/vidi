import {expect} from 'chai';
import {renderDemo} from '../examples/example';
import {NativeEnvironmentSupport} from '../src/utils/environment-detection';

describe('Vidi E2E', function () {
    this.timeout(5000); // 5 seconds

    beforeEach(function () {
        this.stageRoot = renderDemo();
    });

    afterEach(function () {
        document.body.removeChild(this.stageRoot);
    });

    const formatsToTest = [];
    if (NativeEnvironmentSupport.MP4) {
        formatsToTest.push('MP4')
    }

    if (NativeEnvironmentSupport.WEBM) {
        formatsToTest.push('WEBM');
    }

    if (NativeEnvironmentSupport.HLS || NativeEnvironmentSupport.MSE) {
        formatsToTest.push('HLS');
    }

    if (NativeEnvironmentSupport.DASH || NativeEnvironmentSupport.MSE) {
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
