#vidi's API

##constructor
```typescript
new Vidi(nativeVideoEl?: HTMLVideoElement)
```
Returns a new vidi instance that can manage a single `<video>` element.
The instance is also an [EventEmitter3](https://github.com/primus/eventemitter3), which allows subscribing to a normalized set of video events.

`nativeVideoEl` is an optional paramaters which sets the currently managed `<video>`.
Same as not passing a value and later calling [setVideoElement()](#setVideoElement).

##setVideoElement
```typescript
setVideoElement(nativeVideoEl: HTMLVideoElement)
```
Sets the currently managed `<video>` element.
If a previous element is already set, vidi will detach from it.
If a `src` is already set, it will be loaded in the new element. 

##getVideoElement
```typescript
getVideoElement(): HTMLVideoElement
```
Returns the currently managed `<video>` element.

##src getter()
```typescript
get src(): MediaSource
```
Returns the current src.

##src setter() 
```typescript
set src(src: MediaSource): void
```
Sets a new src. If a `<video>` element is already attached, this will stop current playback and load the new src.

*TypeScript: `MediaSource` is an alias for any.* 

