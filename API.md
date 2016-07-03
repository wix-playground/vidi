#vidi's API

####constructor
```ts
class Vidi(nativeVideoEl?: HTMLVideoElement)
```
Returns a new vidi instance.

`nativeVideoEl` is an optional paramaters which sets the currently managed `<video>`.
Same effect as not passing a value and later calling [setVideoElement()](#setVideoElement) with the element.

####setVideoElement
```ts
setVideoElement(nativeVideoEl: HTMLVideoElement)
```
Sets the currently managed `<video>` element.
If a previous element is already set, vidi will detach from it.
If a `src` is already set, it will be loaded in the new element. 

####getVideoElement
```ts
getVideoElement(): HTMLVideoElement
```
Returns the currently managed `<video>` element.

####src getter()
```ts
get src(): MediaSource
```
Returns the current src.

####src setter() 
```ts
set src(src: MediaSource): void
```
Sets a new src. If a `<video>` element is already attached, this will stop current playback and load the new src.

*TypeScript not: `MediaSource` is a type alias for `any`.* 

####play() 
```ts
play(): void
```
Same as calling the native `play()` method on the attached `<video>` node,
but also handles exceptions and Promise rejections (depending on the browser),
and exposes them via the `error` event.

####pause() 
```ts
pause(): void
```
Same as calling the native `pause()` method on the attached `<video>` node,
but also handles exceptions and Promise rejections (depending on the browser),
and exposes them via the `error` event.

####getSourceHandlers() 
```ts
getSourceHandlers(): MediaSourceHandler[]
```
Returns an array of currently registered `MediaSourceHandler`s.

####registerSourceHandler() 
```ts
registerSourceHandler(sourceHandler: MediaSourceHandler): void
```
Registers a new `MediaSourceHandler`.


####getStreamHandlers() 
```ts
getStreamHandlers(): MediaStreamHandler[]
```
Returns an array of currently registered `MediaStreamHandler`s.

####registerStreamHandler() 
```ts
registerStreamHandler(streamHandler: MediaStreamHandler): void
```
Registers a new `MediaStreamHandler`.
