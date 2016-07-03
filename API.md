#vidi's API

###constructor
```ts
new Vidi(nativeVideoEl?: HTMLVideoElement)
```
Returns a new vidi instance that can manage a single `<video>` element.
The instance is also an [EventEmitter3](https://github.com/primus/eventemitter3), which allows subscribing to a normalized set of video events.

`nativeVideoEl` is an optional paramaters which sets the currently managed `<video>`.
Same as not passing a value and later calling [setVideoElement()](#setVideoElement).

###setVideoElement
```ts
setVideoElement(nativeVideoEl: HTMLVideoElement)
```
Sets the currently managed `<video>` element.
If a previous element is already set, vidi will detach from it.
If a `src` is already set, it will be loaded in the new element. 

###getVideoElement
```ts
getVideoElement(): HTMLVideoElement
```
Returns the currently managed `<video>` element.

###src getter()
```ts
get src(): MediaSource
```
Returns the current src.

###src setter() 
```ts
set src(src: MediaSource): void
```
Sets a new src. If a `<video>` element is already attached, this will stop current playback and load the new src.

*TypeScript not: `MediaSource` is a type alias for `any`.* 
