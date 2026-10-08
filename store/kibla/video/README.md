# Kibla preview video

fframes project that renders a 16 s preview of Kibla: the app's screen (arrow, compass ring, degrees off)
recreated from a simulator capture, with the phone turning toward the Qibla and captions on top.
The simulator has no compass, so this is a recreation, not a screen recording; App Store
previews need real footage, so use this for the website, not App Store Connect.

Two Apple files stay out of git and must be copied in first:

- `assets/SF-Mono-Bold.otf`, from Terminal.app.
- `assets/bezel-iphone17-black.png`, the "iPhone 17 - Black - Portrait.png" Product Bezel from
  `Bezel-iPhone-17.dmg` at developer.apple.com/design/resources. Its license forbids
  redistributing the bezel itself.

```bash
cp /System/Applications/Utilities/Terminal.app/Contents/Resources/Fonts/SF-Mono-Bold.otf assets/
cp "/Volumes/Bezel-iPhone-17/PNG/iPhone 17/iPhone 17 - Black - Portrait.png" assets/bezel-iphone17-black.png
cargo build --release
./target/release/video render -o ../preview-886x1920.mp4
VARIANT=framed ./target/release/video render -o ../preview-framed-992x2028.mp4
```

`VARIANT=framed` puts the screen inside the real iPhone frame on the website card colour
(`TINT` in `src/lib.rs`, keep it in sync with `tint` in `src/data/apps.ts`). Website copies
(`public/apps/kibla/`):

```bash
ffmpeg -i ../preview-framed-992x2028.mp4 -vf scale=600:-2 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -an -movflags +faststart ../../../public/apps/kibla/preview.mp4
ffmpeg -ss 10 -i ../preview-framed-992x2028.mp4 -frames:v 1 -vf scale=600:-2 -q:v 3 ../../../public/apps/kibla/poster.jpg
```

`arrow.png` and `bubble.png` are the app's SF Symbols (`arrow.up` bold 160 pt, `text.bubble`
semibold 20 pt) at 4x in the app's terracotta ink, #8A3B14. `Cargo.toml` pins fframes' helper
crates to 1.1.0, same as the Discreet Tasbeeh project.
