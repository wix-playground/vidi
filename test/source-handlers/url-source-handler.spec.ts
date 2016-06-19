import {expect} from 'chai';
import {URLSourceHandler} from '../../src/source-handlers';
import {MediaStreamTypes} from '../../src/types';

describe('URLSourceHandler', function () {
    const urlSourceHandler = new URLSourceHandler;
    function testHandling(ext: string, expectedType: string) {
        it(`should handle string sources with ${ext} extension and return a ${expectedType} MediaStream`, function () {
            const url = 'http://url/a.' + ext;
            expect(urlSourceHandler.canHandleSource(url)).to.equal(true);
            expect(urlSourceHandler.getMediaStream(url)).to.eql({url, type: expectedType});
        });
    }

    testHandling('mp4', MediaStreamTypes.MP4);
    testHandling('webm', MediaStreamTypes.WEBM);
    testHandling('m3u8', MediaStreamTypes.HLS);
    testHandling('mpd', MediaStreamTypes.DASH);

    it('should not handle non-string sources', function () {
        expect(urlSourceHandler.canHandleSource({})).to.equal(false);
        expect(urlSourceHandler.canHandleSource(true)).to.equal(false);
        expect(urlSourceHandler.canHandleSource([])).to.equal(false);
        expect(urlSourceHandler.canHandleSource(null)).to.equal(false);
        expect(urlSourceHandler.canHandleSource(undefined)).to.equal(false);
    });
});
