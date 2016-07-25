import {EnvironmentSupport, MediaStream, PlayableStream, MediaSource, PlayableStreamCreator, EmitEventsFn} from '../types';
import {HlsStream, DashStream} from './playable-streams';

interface GroupedMediaStreams {
    [type: string]: MediaStream[]
}

export function resolvePlayableStreams(mediaStreams: MediaStream[], playableStreamCreators: PlayableStreamCreator[], emit: EmitEventsFn): PlayableStream[] {
    const playableStreams: PlayableStream[] = [];
    const groupedStreams = groupStreamsByMediaType(mediaStreams);
    Object.keys(groupedStreams).forEach(mediaType => {
        const mediaStreams = groupedStreams[mediaType]

        for (let i = 0; i < playableStreamCreators.length; ++i) {
            const StreamHandler = playableStreamCreators[i];
            if (StreamHandler.canPlay(mediaType)) {
                playableStreams.push(new StreamHandler(mediaStreams, emit));
                break;
            }
        };
    });

    playableStreams.sort((firstStream: PlayableStream, secondStream: PlayableStream) =>
        secondStream.getMediaStreamDeliveryType() - firstStream.getMediaStreamDeliveryType());

    return playableStreams;
}

function groupStreamsByMediaType(mediaStreams: MediaStream[]): GroupedMediaStreams {
    const typeMap: GroupedMediaStreams = {};
    mediaStreams.forEach(mediaStream => {
        if (typeMap[mediaStream.type]) {
            typeMap[mediaStream.type].push(mediaStream)
        } else {
            typeMap[mediaStream.type] = [mediaStream];
        }
    });
    return typeMap;
}
