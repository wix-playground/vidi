export const MediaStreamTypes = {
    MP4: 'MP4',
    WEBM: 'WEBM',
    HLS: 'HLS',
    DASH: 'DASH'
}

export enum MediaStreamDeliveryType {
    NATIVE_PROGRESSIVE,
    ADAPTIVE_VIA_MSE,
    NATIVE_ADAPTIVE
}

export interface MediaStream {
    url: string;
    type: string;
    name?: string;
    [key: string]: any;
};
