export interface EventListener {
    callback: Function;
    once: boolean;
}

export interface EventListenerMap {
    [type: string]: EventListener[];
}
