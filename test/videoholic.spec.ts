import EventEmitter = require('eventemitter3');
import {expect} from 'chai';
import Videoholic from '../src';
import {createdMockedVideoElement} from './mocked-video-element';
import {nativeVideoEvents} from '../src/events';
import {defaultPlaybackState, PlaybackState, PlaybackStatus} from '../src/playback-state';

// Sample video data
const duration = 50, currentTime = 5, muted = true, playbackRate = 0.75, paused = false, volume = 0.9;

// Parameters for mocked video creation
const mockedVideoParams = { duration, currentTime, muted, playbackRate, volume, paused };

// Matching state for the above sample data
const matchingPlaybackState: PlaybackState = { duration, currentTime, muted, playbackRate, volume, status: PlaybackStatus.PLAYING };

const handledNativeEvents = Object.keys(nativeVideoEvents);

describe('Videoholic', function () {
    describe('Construction', function () {
        it('can be constructed without any parameters', function () {
            const videoholic = new Videoholic();

            expect(videoholic.getVideoElement()).to.equal(null);
        });

        it('can be constructed with an HTMLVideoElement', function () {
            const vidEl = createdMockedVideoElement();

            const videoholic = new Videoholic(vidEl);

            expect(videoholic.getVideoElement()).to.equal(vidEl);
        });

        it('is an instance of EventEmitter', function () {
            const videoholic = new Videoholic();

            expect(videoholic).to.be.instanceof(EventEmitter);
        });

        it('adds native video event listeners when constructed with an HTMLVideoElement', function () {
            const vidEl = createdMockedVideoElement();

            const videoholic = new Videoholic(vidEl);

            handledNativeEvents.forEach(e => {
                expect(vidEl.listeners[e].length).to.equal(1);
            })
        });
    });

    describe('Public API', function () {
        describe('setVideoElement()', function () {

            it('allows changing the current HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();
                const vidEl2 = createdMockedVideoElement();

                const videoholic = new Videoholic(vidEl);
                expect(videoholic.getVideoElement()).to.equal(vidEl);
                videoholic.setVideoElement(vidEl2)

                expect(videoholic.getVideoElement()).to.equal(vidEl2);
            });

            it('adds native video event listeners when set to a new HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();
                const vidEl2 = createdMockedVideoElement();

                const videoholic = new Videoholic(vidEl);
                videoholic.setVideoElement(vidEl2)

                handledNativeEvents.forEach(e => {
                    expect(vidEl2.listeners[e].length).to.equal(1);
                })
            });

            it('does not re-add listeners if set to the current HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();

                const videoholic = new Videoholic(vidEl);
                videoholic.setVideoElement(vidEl);

                handledNativeEvents.forEach(e => {
                    expect(vidEl.listeners[e].length).to.equal(1);
                });
            });

            it('removes listeners from previous HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();
                const vidEl2 = createdMockedVideoElement();

                const videoholic = new Videoholic(vidEl);

                handledNativeEvents.forEach(e => {
                    expect(vidEl.listeners[e].length).to.equal(1);
                });

                videoholic.setVideoElement(vidEl2);

                handledNativeEvents.forEach(e => {
                    expect(vidEl.listeners[e].length).to.equal(0);
                });
            });
        });

        describe('getPlaybackState()', function () {

            it('returns the current playback state of the set HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement(mockedVideoParams);

                const videoholic = new Videoholic(vidEl);

                expect(videoholic.getPlaybackState()).to.eql(matchingPlaybackState);
            });

            it('returns the defaultPlaybackState when no HTMLVideoElement is set', function () {
                const videoholic = new Videoholic();

                expect(videoholic.getPlaybackState()).to.eql(defaultPlaybackState);
            });
        });

        describe('play()', function () {
            it(`calls the HTMLVideoElement's play method`, function () {
                const vidEl = createdMockedVideoElement();

                const videoholic = new Videoholic(vidEl);
                videoholic.play()

                expect(vidEl.playCalled).to.equal(true);
            });

            it(`does not throw if no HTMLVideoElement is set`, function () {
                const videoholic = new Videoholic();

                expect(videoholic.play()).to.not.throw;
            });
        });

        describe('pause()', function () {
            it(`calls the HTMLVideoElement's pause method`, function () {
                const vidEl = createdMockedVideoElement();

                const videoholic = new Videoholic(vidEl);
                videoholic.pause()

                expect(vidEl.pauseCalled).to.equal(true);
            });
            
            it(`does not throw if no HTMLVideoElement is set`, function () {
                const videoholic = new Videoholic();

                expect(videoholic.pause()).to.not.throw;
            });
        });
    });

    describe('Events', function () {
        const vidEl = createdMockedVideoElement(mockedVideoParams);

        const videoholic = new Videoholic(vidEl);

        function testNativeVideoEvent(nativeEventType: string, expectedEventType: string, expectedData: any, dataDesc: string) {
            it(`emits a ${expectedEventType} event with the current ${dataDesc} when native reports ${nativeEventType}`, function (done) {
                videoholic.once(expectedEventType, data => {
                    expect(data).to.eql(expectedData);
                    done();
                })

                vidEl.emit(nativeEventType); // Simulate the event coming from the video element itself
            });
        }

        const eventsToTest = [
            {
                nativeEventType: 'durationchange',
                expectedEventType: 'durationchange',
                expectedData: duration,
                dataDesc: 'duration'
            },
            {
                nativeEventType: 'loadstart',
                expectedEventType: 'loadstart',
                expectedData: matchingPlaybackState,
                dataDesc: 'playback state'
            },
            {
                nativeEventType: 'ratechange',
                expectedEventType: 'ratechange',
                expectedData: playbackRate,
                dataDesc: 'playback rate'
            },
            {
                nativeEventType: 'timeupdate',
                expectedEventType: 'timeupdate',
                expectedData: currentTime,
                dataDesc: 'time'
            },
            {
                nativeEventType: 'volumechange',
                expectedEventType: 'volumechange',
                expectedData: { volume, muted },
                dataDesc: 'volume data'
            },
            {
                nativeEventType: 'seeked',
                expectedEventType: 'statuschange',
                expectedData: PlaybackStatus.PLAYING,
                dataDesc: 'playback status'
            },
            {
                nativeEventType: 'play',
                expectedEventType: 'statuschange',
                expectedData: PlaybackStatus.PLAYING_BUFFERING,
                dataDesc: 'playback status'
            },
            {
                nativeEventType: 'seeking',
                expectedEventType: 'statuschange',
                expectedData: PlaybackStatus.PLAYING_BUFFERING,
                dataDesc: 'playback status'
            },
            {
                nativeEventType: 'playing',
                expectedEventType: 'statuschange',
                expectedData: PlaybackStatus.PLAYING,
                dataDesc: 'playback status'
            },
            {
                nativeEventType: 'pause',
                expectedEventType: 'statuschange',
                expectedData: PlaybackStatus.PAUSED,
                dataDesc: 'playback status'
            },
            {
                nativeEventType: 'ended',
                expectedEventType: 'statuschange',
                expectedData: PlaybackStatus.ENDED,
                dataDesc: 'playback status'
            }
        ];

        eventsToTest.forEach(testCase => {
            testNativeVideoEvent(testCase.nativeEventType, testCase.expectedEventType, testCase.expectedData, testCase.dataDesc);
        });
    });

});