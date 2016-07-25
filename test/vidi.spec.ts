import {expect} from 'chai';
import Vidi from '../src';
import {createdMockedVideoElement, createMockedStreamHandler, createdMockedSourceHandler} from '../test-kit';
import {getNativeEventsHandlers} from '../src/events';
import {defaultPlaybackState, PlaybackState, PlaybackStatus, PlayableStream} from '../src/types';

// Sample video data
const duration = 50, currentTime = 5, muted = true, playbackRate = 0.75, paused = false, volume = 0.9;

// Parameters for mocked video creation
const mockedVideoParams = { duration, currentTime, muted, playbackRate, volume, paused };

// Matching state for the above sample data
const matchingPlaybackState: PlaybackState = { duration, currentTime, muted, playbackRate, volume, status: PlaybackStatus.PLAYING };

const handledNativeEvents = Object.keys(getNativeEventsHandlers(null));

describe('Vidi', function () {
    describe('Construction', function () {
        it('can be constructed without any parameters', function () {
            const vidi = new Vidi();

            expect(vidi.getVideoElement()).to.equal(null);
        });

        it('can be constructed with an HTMLVideoElement', function () {
            const vidEl = createdMockedVideoElement();

            const vidi = new Vidi(vidEl);

            expect(vidi.getVideoElement()).to.equal(vidEl);
        });
    });

    describe('Public API', function () {
        describe('src field', function () {
            it('allows setting the current src', function () {
                const src = 'http://sampleurl/a.mp4';
                const vidi = new Vidi();

                vidi.src = src;

                expect(vidi.src).to.equal(src)
            });

            // it('attaches a compatible stream handler once src changes', function () {
            //     const src = 'http://sampleurl/a.mp4';
            //     const vidi = new Vidi(createdMockedVideoElement());
            //     const streamHandler = createMockedStreamHandler();

            //     vidi.registerStreamHandler(streamHandler);
            //     vidi.src = src;

            //     expect(streamHandler.attachCalled).to.equal(true)
            // });

            //     it('detaches the current handler before attaching a new matching one', function () {
            //         const src = 'http://sampleurl/a.mp4';
            //         const anotherSrc = 'http://sampleurl/another.mp4';
            //         const vidi = new Vidi(createdMockedVideoElement());
            //         const streamHandler = createMockedStreamHandler();

            //         vidi.registerStreamHandler(streamHandler);
            //         vidi.src = src;
            //         vidi.src = anotherSrc;

            //         expect(streamHandler.detachCalled).to.equal(true)
            //     });
        });

        describe('play()', function () {
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

        describe('pause()', function () {
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

        describe('getPlaybackState()', function () {

            it('returns the current playback state of the set HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement(mockedVideoParams);

                const vidi = new Vidi(vidEl);

                expect(vidi.getPlaybackState()).to.eql(matchingPlaybackState);
            });

            it('returns the defaultPlaybackState when no HTMLVideoElement is set', function () {
                const vidi = new Vidi();

                expect(vidi.getPlaybackState()).to.eql(defaultPlaybackState);
            });
        });

        describe('setVideoElement()', function () {

            it('allows changing the current HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();
                const vidEl2 = createdMockedVideoElement();

                const vidi = new Vidi(vidEl);
                expect(vidi.getVideoElement()).to.equal(vidEl);
                vidi.setVideoElement(vidEl2)

                expect(vidi.getVideoElement()).to.equal(vidEl2);
            });

            it('adds native video event listeners when set to a new HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();
                const vidEl2 = createdMockedVideoElement();

                const vidi = new Vidi(vidEl);
                vidi.setVideoElement(vidEl2)

                handledNativeEvents.forEach(e => {
                    expect(vidEl2.listeners[e].length).to.equal(1);
                })
            });

            it('does not re-add listeners if set to the current HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();

                const vidi = new Vidi(vidEl);
                vidi.setVideoElement(vidEl);

                handledNativeEvents.forEach(e => {
                    expect(vidEl.listeners[e].length).to.equal(1);
                });
            });

            it('removes listeners from previous HTMLVideoElement', function () {
                const vidEl = createdMockedVideoElement();
                const vidEl2 = createdMockedVideoElement();

                const vidi = new Vidi(vidEl);

                handledNativeEvents.forEach(e => {
                    expect(vidEl.listeners[e].length).to.equal(1);
                });

                vidi.setVideoElement(vidEl2);

                handledNativeEvents.forEach(e => {
                    expect(vidEl.listeners[e].length).to.equal(0);
                });
            });

            // it('attaches a compatible stream handler when set to a new HTMLVideoElement', function () {
            //     const vidEl = createdMockedVideoElement();
            //     const vidEl2 = createdMockedVideoElement();
            //     const src = 'http://sampleurl/a.mp4';
            //     const vidi = new Vidi(vidEl);
            //     const streamHandler = createMockedStreamHandler();

            //     vidi.registerStreamHandler(streamHandler);
            //     vidi.src = src;
            //     vidi.setVideoElement(vidEl2);

            //     expect(streamHandler.attachCalled).to.equal(true);
            //     expect(streamHandler.attachCallCount).to.equal(2);
            //     expect(streamHandler.detachCallCount).to.equal(1);
            // });
        });

        // describe('registerStreamHandler()', function () {
        //     it('allows registering a new handler', function () {
        //         const vidi = new Vidi();
        //         const mockedHandler = createMockedStreamHandler();
        //         vidi.registerStreamHandler(mockedHandler);

        //         expect(vidi.getStreamHandlers()).to.contain(mockedHandler)
        //     });
        // });

        // describe('getStreamHandlers()', function () {
        //     it('returns all registered stream handlers', function () {
        //         const vidi = new Vidi();
        //         const mockedHandler = createMockedStreamHandler();
        //         const builtInHandlers = vidi.getStreamHandlers();
        //         const expectedHandlers = [mockedHandler as MediaStreamHandler].concat(builtInHandlers);

        //         vidi.registerStreamHandler(mockedHandler);

        //         expect(vidi.getStreamHandlers()).to.eql(expectedHandlers)
        //     });
        // });

    });

    describe('Events', function () {
        const vidEl = createdMockedVideoElement(mockedVideoParams);

        const vidi = new Vidi(vidEl);

        function testNativeVideoEvent(nativeEventType: string, expectedEventType: string, expectedData: any, dataDesc: string) {
            it(`emits a ${expectedEventType} event with the current ${dataDesc} when HTMLVideoElement fires ${nativeEventType}`, function (done) {
                vidi.once(expectedEventType, data => {
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