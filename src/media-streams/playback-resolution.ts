import {ResolvedMediaStream, PlayableStream, PlayableStreamCreator, EmitEventsFn} from '../types';

interface GroupedMediaStreams {
    [type: string]: ResolvedMediaStream[]
}

export function resolvePlayableStreams(mediaStreams: ResolvedMediaStream[], playableStreamCreators: PlayableStreamCreator[], emit: EmitEventsFn): PlayableStream[] {
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

function groupStreamsByMediaType(mediaStreams: ResolvedMediaStream[]): GroupedMediaStreams {
    const typeMap: GroupedMediaStreams = {};
    mediaStreams.forEach(mediaStream => {
        const currentValue = typeMap[mediaStream.type];
        if (!Array.isArray(typeMap[mediaStream.type])) {
            typeMap[mediaStream.type] = [];
        }
        typeMap[mediaStream.type].push(mediaStream)
    });
    return typeMap;
}
