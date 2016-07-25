export interface EventListener {
    callback: Function;
    once: boolean;
}

export interface EventListenerMap {
    [type: string]: EventListener[];
}

export type EmitEventsFn = (eventType: string, ...args) => void;
