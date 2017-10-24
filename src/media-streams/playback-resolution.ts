import {MediaStream, PlayableStream, PlayableStreamCreator, EmitEventsFn} from '../types';

interface GroupedMediaStreams {
    [type: string]: MediaStream[]
}

export function resolvePlayableStreams(mediaStreams: MediaStream[], playableStreamCreators: PlayableStreamCreator[], emit: EmitEventsFn): PlayableStream[] {
    const playableStreams: PlayableStream[] = [];
    const groupedStreams = groupStreamsByMediaType(mediaStreams);
    
    Object.keys(groupedStreams).forEach(mediaType => {
        const mediaStreams = groupedStreams[mediaType]

        for (let i = 0; i < playableStreamCreators.length; ++i) {
            const playableStreamCreator = playableStreamCreators[i];
            if (playableStreamCreator.canPlay(mediaType)) {
                playableStreams.push(new playableStreamCreator(mediaStreams, emit));
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
        if (!Array.isArray(typeMap[mediaStream.type])) {
            typeMap[mediaStream.type] = [];
        }
        typeMap[mediaStream.type].push(mediaStream)
    });
    return typeMap;
}
