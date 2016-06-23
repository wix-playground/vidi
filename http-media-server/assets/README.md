### Commands used to create video samples:

MP4
```bash
ffmpeg -framerate 1/5 -i MP4.png -r 30 -c:v libx264 -crf 22 -movflags faststart -pix_fmt yuv420p sample.mp4
```

HLS
```bash
ffmpeg -framerate 1/5 -i HLS.png -r 30 -c:v libx264 -crf 22 -movflags faststart -pix_fmt yuv420p HLS.mp4
ffmpeg -i HLS.mp4 sample.m3u8
rm HLS.mp4
```