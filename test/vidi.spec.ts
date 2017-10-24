import {expect} from 'chai';
import Vidi from '../src';
import {createdMockedVideoElement} from '../test-kit';
import {defaultPlaybackState, PlaybackState, PlaybackStatus} from '../src/types';

// Sample video data
const duration = 50, currentTime = 5, muted = true, playbackRate = 0.75, paused = false, volume = 0.9;

// Parameters for mocked video creation
const mockedVideoParams = { duration, currentTime, muted, playbackRate, volume, paused };

// Matching state for the above sample data
const matchingPlaybackState: PlaybackState = { duration, currentTime, muted, playbackRate, volume, status: PlaybackStatus.PLAYING };

describe('Vidi instance', function () {
    it('can be constructed with or without a HTMLVideoElement', function () {
        const videoElement = document.createElement('video');

        expect(new Vidi()).to.not.throw;
        expect(new Vidi(videoElement)).to.not.throw;
    });

    describe('play() method', function () {
        it(`calls the HTMLVideoElement's play method`, function () {
            const vidEl = createdMockedVideoElement();

            const vidi = new Vidi(vidEl);
            vidi.play()

            expect(vidEl.playCalled).to.equal(true);
        });

        it(`does not throw if no HTMLVideoElement is set`, function () {
            const vidi = new Vidi();

            expect(vidi.play()).to.not.throw;
        });
    });

    describe('pause() method', function () {
        it(`calls the HTMLVideoElement's pause method`, function () {
            const vidEl = createdMockedVideoElement();

            const vidi = new Vidi(vidEl);
            vidi.pause()

            expect(vidEl.pauseCalled).to.equal(true);
        });

        it(`does not throw if no HTMLVideoElement is set`, function () {
            const vidi = new Vidi();

            expect(vidi.pause()).to.not.throw;
        });
    });

    describe('getPlaybackState() method', function () {

        it('returns the playback state of the currently set HTMLVideoElement', function () {
            const vidEl = createdMockedVideoElement(mockedVideoParams);

            const vidi = new Vidi(vidEl);

            expect(vidi.getPlaybackState()).to.eql(matchingPlaybackState);
        });

        it('returns the defaultPlaybackState when no HTMLVideoElement is set', function () {
            const vidi = new Vidi();

            expect(vidi.getPlaybackState()).to.eql(defaultPlaybackState);
        });
    });

    describe('setVideoElement() method', function () {

        it('allows changing the currently set HTMLVideoElement', function () {
            const vidEl = createdMockedVideoElement();
            const vidEl2 = createdMockedVideoElement();

            const vidi = new Vidi(vidEl);
            expect(vidi.getVideoElement()).to.equal(vidEl);
            vidi.setVideoElement(vidEl2)

            expect(vidi.getVideoElement()).to.equal(vidEl2);
        });

        it('stops listening for events coming from previous HTMLVideoElement', function () {
            const initialDuration = 123, initialVideoElement = createdMockedVideoElement({duration: initialDuration});
            const newDuration = 456, newVideoElement = createdMockedVideoElement({duration: newDuration});
            let receivedDuration = 0;

            const vidi = new Vidi(initialVideoElement);
            vidi.on('durationchange', newDuration => receivedDuration = newDuration)

            initialVideoElement.emit('durationchange');
            expect(receivedDuration).to.equal(initialDuration);

            vidi.setVideoElement(newVideoElement);
            newVideoElement.emit('durationchange');
            expect(receivedDuration).to.equal(newDuration);

            initialVideoElement.emit('durationchange');
            expect(receivedDuration).to.equal(newDuration);
        });
    });
});
