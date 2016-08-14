import {expect} from 'chai';
import {detectStreamType} from '../src/media-streams';
import {Vidi} from '../src';

describe('Stream type auto detection', function () {
    const testURL = 'http://mocked-domain.com/some/internalPath/';
    const formatsToTest = [
        { type: Vidi.MediaStreamTypes.MP4, fileName: 'video.mp4' },
        { type: Vidi.MediaStreamTypes.WEBM, fileName: 'video.webm' },
        { type: Vidi.MediaStreamTypes.HLS, fileName: 'video.m3u8' },
        { type: Vidi.MediaStreamTypes.DASH, fileName: 'video.mpd' },
    ];

    formatsToTest.forEach(formatToTest => {
        it(`should detect ${formatToTest.type} URLs`, function () {
            const URL = testURL + formatToTest.fileName;

            expect(detectStreamType(URL)).to.equal(formatToTest.type)
        });
    });
    it('should detect type even if URL contains query params and/or fragments', function () {
        const mp4URL = testURL + 'video.mp4';
        const queryParam = '?data=true';
        const fragment = '#sectionOnPage';

        expect(detectStreamType(mp4URL + queryParam)).to.equal(Vidi.MediaStreamTypes.MP4);
        expect(detectStreamType(mp4URL + fragment)).to.equal(Vidi.MediaStreamTypes.MP4);
        expect(detectStreamType(mp4URL + queryParam + fragment)).to.equal(Vidi.MediaStreamTypes.MP4);
    });

    // it('should throw if it cannot detect type', function () {
    //     expect(detectStreamType(testURL + 'video.unknown')).to.throw('test');
    // });
});
