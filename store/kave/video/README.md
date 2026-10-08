# Kave preview video

fframes project that renders a 12.4 s loop of Kave: a code editor on a warm desktop, with
kave's keycaps showing each shortcut as it happens. The shortcuts really edit the code (⌘⇧K
deletes a line, ⌘Z brings it back, ⌥↑/⌥↓ move it, ⌘F finds, esc closes, ⌘S saves), and the
last frame matches the first so it loops cleanly. The keycaps are a recreation of the app's,
with the same proportions, dark palette, springs and timings (kave's `src/theme.rs` and
`src/platform/macos/overlay.rs`).

The fonts are Apple's and stay out of git; copy them in first. SF Pro Rounded only ships as a
variable font, so make static instances of it with fonttools
(`pip install fonttools`):

```bash
cp /System/Applications/Utilities/Terminal.app/Contents/Resources/Fonts/SF-Mono-{Regular,Medium}.otf assets/
python3 - <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
for weight, style in [(500, "Medium"), (600, "Semibold"), (700, "Bold")]:
    f = instancer.instantiateVariableFont(TTFont("/System/Library/Fonts/SFNSRounded.ttf"), {"wght": weight, "GRAD": 400})
    name = f["name"]
    for id in (1, 2, 3, 4, 6, 16, 17, 21, 22, 25):
        name.removeNames(nameID=id)
    for id, value in [(1, "SF Pro Rounded"), (2, "Regular"), (4, f"SF Pro Rounded {style}"),
                      (6, f"SFProRounded-{style}"), (16, "SF Pro Rounded"), (17, style)]:
        name.setName(value, id, 3, 1, 0x409)
    f["OS/2"].usWeightClass = weight
    f.save(f"assets/SF-Pro-Rounded-{style}.ttf")
PY
cargo build --release
./target/release/video render -o ../preview-1800x1200.mp4
```

Website copies (`public/apps/kave/`):

```bash
ffmpeg -i ../preview-1800x1200.mp4 -vf scale=1200:-2 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -an -movflags +faststart ../../../public/apps/kave/preview.mp4
ffmpeg -ss 1.05 -i ../preview-1800x1200.mp4 -frames:v 1 -vf scale=1200:-2 -q:v 3 ../../../public/apps/kave/poster.jpg
```

`./target/release/video preview` plays it in a window. `Cargo.toml` pins fframes' helper crates
to 1.1.0, same as the Kibla project.
