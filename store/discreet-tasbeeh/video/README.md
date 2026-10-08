# Discreet Tasbeeh store art

fframes project that renders the App Store header, search results asset, captioned
screenshots and app preview from the real captures in `assets/`.

`ASSET` picks the output: `header`, `search`, `shot-6.3-N`, `shot-6.9-N`, `shot-duo-N`
(N = 1..3) or `preview`.

Phones use Apple's Product Bezels from `Bezel-iPhone-17.dmg`
(developer.apple.com/design/resources). Their license forbids redistributing them, so they stay
out of git; copy them into `assets/` first:

```bash
cp "/Volumes/Bezel-iPhone-17/PNG/iPhone 17/iPhone 17 - Black - Portrait.png" assets/bezel-iphone17-black.png
cp "/Volumes/Bezel-iPhone-17/PNG/iPhone 17 Pro Max/iPhone 17 Pro Max - Deep Blue - Portrait.png" assets/bezel-iphone17promax-deepblue.png
```

```bash
cargo build --release
ASSET=header ./target/release/video frame 0 -o out
ASSET=preview ./target/release/video render -o preview.mp4
```

The preview then gets a silent stereo AAC track (App Store Connect expects audio):

```bash
ffmpeg -i preview.mp4 -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -shortest \
  -map 0:v -map 1:a -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -r 30 -b:v 8M \
  -c:a aac -b:a 256k -movflags +faststart ../upload/04-iphone-6.3-app-preview-886x1920.mp4
```

`Cargo.toml` pins fframes' helper crates to 1.1.0: their 1.2 releases pull a `usvgr` that
fframes 1.1.0 does not compile against.
