import {expect} from 'chai';
import Vidi from '../src';
import {createdMockedVideoElement} from '../test-kit';
import {PlaybackState, PlaybackStatus} from '../src/types';

// Sample video data
const duration = 50, currentTime = 5, muted = true, playbackRate = 0.75, paused = false, volume = 0.9;

// Parameters for mocked video creation
const mockedVideoParams = { duration, currentTime, muted, playbackRate, volume, paused };

// Matching state for the above sample data
const matchingPlaybackState: PlaybackState = { duration, currentTime, muted, playbackRate, volume, status: PlaybackStatus.PLAYING };

describe('Events integration tests', function () {
    const videoElement = createdMockedVideoElement(mockedVideoParams);
    const vidi = new Vidi(videoElement);

    function testNativeVideoEvent(nativeEventType: string, expectedEventType: string, expectedData: any, dataDesc: string) {
        it(`emits a ${expectedEventType} event with the current ${dataDesc} when HTMLVideoElement fires ${nativeEventType}`, function (done) {
            vidi.once(expectedEventType, data => {
                expect(data).to.eql(expectedData);
                done();
            })

            videoElement.emit(nativeEventType); // Simulate the event coming from the video element itself
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