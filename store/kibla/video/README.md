# Kibla preview video

fframes project that renders a 16 s preview of Kibla: the app's screen (arrow + degrees off)
recreated from a simulator capture, with the phone turning toward the Qibla and captions on top.
The simulator has no compass, so this is a recreation, not a screen recording; App Store
previews need real footage, so use this for the website, not App Store Connect.

`assets/SF-Mono-Bold.otf` is Apple's font and stays out of git; copy it in first:

```bash
cp /System/Applications/Utilities/Terminal.app/Contents/Resources/Fonts/SF-Mono-Bold.otf assets/
cargo build --release
./target/release/video render -o ../preview-886x1920.mp4
```

Website copies (`public/apps/kibla/`):

```bash
ffmpeg -i ../preview-886x1920.mp4 -vf scale=576:-2 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -an -movflags +faststart ../../../public/apps/kibla/preview.mp4
ffmpeg -ss 10 -i ../preview-886x1920.mp4 -frames:v 1 -vf scale=576:-2 -q:v 3 ../../../public/apps/kibla/poster.jpg
```

`arrow.png` and `bubble.png` are the app's SF Symbols (`arrow.up` bold 160 pt, `text.bubble`
semibold 20 pt) at 4x in the app's ink colour, #0F0F0F. `Cargo.toml` pins fframes' helper
crates to 1.1.0, same as the Discreet Tasbeeh project.
