import {expect} from 'chai';
import {MediaStreamSourceHandler} from '../../src/source-handlers';
import {MediaStream, MediaStreamTypes} from '../../src/types';

describe ('MediaStreamSourceHandler', function () {
    const mediaStreamSourceHandler = new MediaStreamSourceHandler;
    it(`should handle MediaStream sources and return them as they are`, function () {
        const src: MediaStream = {url: 'http://url/to/asset/without/extension/', type:'HLS', moreData: {test: 123}};
        expect(mediaStreamSourceHandler.canHandleSource(src)).to.equal(true);
        expect(mediaStreamSourceHandler.getMediaStreams(src)).to.eql([src]);
    });

    it('should not handle non-MediaStream sources', function () {
        expect(mediaStreamSourceHandler.canHandleSource({})).to.equal(false);
        expect(mediaStreamSourceHandler.canHandleSource({ url: '' })).to.equal(false);  // Only url
        expect(mediaStreamSourceHandler.canHandleSource({ type: '' })).to.equal(false); // Only type
        expect(mediaStreamSourceHandler.canHandleSource(true)).to.equal(false);
        expect(mediaStreamSourceHandler.canHandleSource([])).to.equal(false);
        expect(mediaStreamSourceHandler.canHandleSource(null)).to.equal(false);
        expect(mediaStreamSourceHandler.canHandleSource(undefined)).to.equal(false);
    });
});
