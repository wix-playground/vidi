#vidi's API

####constructor
```ts
class Vidi(nativeVideoEl?: HTMLVideoElement)
```
Returns a new vidi instance.

`nativeVideoEl` is an optional paramaters and is a shorthand for:
```ts
const vidi = new Vidi();
vidi.setVideoElement(nativeVideoEl);
```

####setVideoElement
```ts
setVideoElement(nativeVideoEl: HTMLVideoElement)
```
Attaches to a new `<video>` element.
If a previous element was set, `vidi` will detach from it.
If a `src` was set, it will be loaded in the new element. 

####getVideoElement
```ts
getVideoElement(): HTMLVideoElement
```
Returns the currently attached `<video>` element.

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
