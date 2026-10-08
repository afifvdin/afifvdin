# QProfiler preview video

fframes project that renders a 25.5 s preview of QProfiler from real window captures of the app
(`../screenshots/`, linked into `assets/`). Each screenshot sits in a Mac window on the website card
colour while the camera eases into the detail the caption is about: the misestimate badges in
the Postgres plan, a sort spilling to disk, two runs compared, the workload, and TigerGraph's
profiler peak next to the real memory peak. It ends on the icon and name.

The captures were taken in light mode at 1500x1000 with neutral connection names and
`localhost` hosts (a local port forward), so no addresses or tailnet names show.

```bash
cargo build --release
./target/release/video render -o ../preview-1800x1200.mp4
```

`TINT` in `src/lib.rs` is the card colour; keep it in sync with `tint` in `src/data/apps.ts`.
Website copies (`public/apps/qprofiler/`):

```bash
ffmpeg -i ../preview-1800x1200.mp4 -vf scale=1200:-2 -c:v libx264 -crf 30 -preset veryslow -pix_fmt yuv420p -an -movflags +faststart ../../../public/apps/qprofiler/preview.mp4
ffmpeg -ss 4.4 -i ../preview-1800x1200.mp4 -frames:v 1 -vf scale=1200:-2 -q:v 3 ../../../public/apps/qprofiler/poster.jpg
```

Screen text is dense, so the web copy uses CRF 30 to stay near the other previews' size.
`./target/release/video preview` plays it in a window. `Cargo.toml` pins fframes' helper crates
to 1.1.0, same as the Kibla project.
