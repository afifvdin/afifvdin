# Kybla preview video

fframes project that renders a 16 s preview of Kybla: the app's screen (arrow, compass ring, degrees off)
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
ASSET=framed ./target/release/video render -o ../preview-framed-992x2028.mp4
```

`ASSET=framed` (or the older `VARIANT=framed`) puts the screen inside the real iPhone frame on the website card colour
(`TINT` in `src/lib.rs`, keep it in sync with `tint` in `src/data/apps.ts`). Website copies
(`public/apps/kybla/`):

```bash
ffmpeg -i ../preview-framed-992x2028.mp4 -vf scale=600:-2 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -an -movflags +faststart ../../../public/apps/kybla/preview.mp4
ffmpeg -ss 10 -i ../preview-framed-992x2028.mp4 -frames:v 1 -vf scale=600:-2 -q:v 3 ../../../public/apps/kybla/poster.jpg
```

`arrow.png` and `bubble.png` are the app's SF Symbols (`arrow.up` bold 160 pt, `text.bubble`
semibold 20 pt) at 4x in the app's terracotta ink, #8A3B14. `Cargo.toml` pins fframes' helper
crates to 1.1.0, same as the Discreet Tasbeeh project.

## App Store stills

`ASSET` picks the output: `preview` (default), `framed`, `header`, `search`, `shot-6.3-N`,
`shot-6.9-N` (N = 1..3). Stills are 1-frame renders; export them flattened to `../upload/`:

```bash
for a in header search shot-6.3-1 shot-6.3-2 shot-6.3-3 shot-6.9-1 shot-6.9-2 shot-6.9-3; do
  ASSET=$a ./target/release/video frame 0 -o out/$a
done
ffmpeg -i out/header/0.png -pix_fmt rgb24 ../upload/01-header-3840x1646.png   # and so on, see ../listing.md
```

They use real simulator captures in `assets/` (`17-*.png` = iPhone 17, 6.3"; `17promax-*.png` =
iPhone 17 Pro Max, 6.9"). The simulator has no compass, so the app treats the phone as facing
north; the location alone sets the arrow:

| Capture | `simctl location set` | Arrow |
| --- | --- | --- |
| `*-jakarta.png` | `-6.2088,106.8456` | 65° |
| `*-london.png` | `51.5074,-0.1278` | 119° |
| `*-aligned.png` | `13.0,39.8262` (due south of Mecca) | 0° |

Install the Debug build, `xcrun simctl privacy <udid> grant location com.afifvdin.Kybla`, set the
location, launch, wait ~4 s, then `xcrun simctl io <udid> screenshot`.

The 6.9" stills also need `assets/bezel-iphone17promax-deepblue.png` ("iPhone 17 Pro Max - Deep Blue -
Portrait.png" from the same DMG; gitignored like the other bezel).
