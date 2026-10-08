//! `ASSET=<name> cargo run --release -- <fframes command>` picks what to render:
//! header, search, shot-6.3-N, shot-6.9-N, shot-duo-N (N = 1..3), preview, or framed
//! (the preview inside the iPhone frame on the website card colour).
use fframes::{EncoderOptions, MediaDirectory, RenderOptions, Video, cli};
use fframes_skia_renderer::{SkiaFFramesRenderer, SkiaPipelineConcurrencyPolicy, SkiaPipelineConfig, metal::SkiaMetalCtx};
use std::process::ExitCode;
use video::{AppPreview, FramedPreview, SHOTS, Still, StillImage};

fn run<'m, V: Video + Send + Sync>(video: &V, media: &'m dyn fframes::MediaProvider<'m>) -> ExitCode {
    let gpu = SkiaMetalCtx::new(V::WIDTH, V::HEIGHT).expect("GPU context");
    cli::new(
        video,
        RenderOptions {
            media: Some(media),
            video_encoder_options: EncoderOptions {
                preferred_encoder: Some("libx264"),
                codec_params: Some(&[("crf", "14"), ("preset", "slow")]),
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .backend(
        SkiaFFramesRenderer::new_metal(&gpu, SkiaPipelineConfig { concurrency_policy: SkiaPipelineConcurrencyPolicy::MaxPerformance, ..Default::default() })
            .expect("skia renderer"),
    )
    .preview(fframes_native_player::cli_preview)
    .run()
}

fn shot(size: &str, n: usize) -> Option<Still> {
    let (name, lines) = SHOTS.get(n.checked_sub(1)?)?;
    // The 6.9" set uses the Pro Max captures; 6.3" and Duo use the iPhone 17 ones.
    let image: &'static str = match (size, *name) {
        ("6.9", "count33") => "17promax-count33.png",
        ("6.9", "count7") => "17promax-count7.png",
        ("6.9", _) => "17promax-count100.png",
        (_, "count33") => "17-count33.png",
        (_, "count7") => "17-count7.png",
        _ => "17-count100.png",
    };
    Some(Still::Shot { lines: *lines, image })
}

fn main() -> ExitCode {
    let dir = MediaDirectory::read_folder("assets").expect("assets folder");
    let media = dir.process_media_source().expect("media");
    let asset = std::env::var("ASSET").unwrap_or_else(|_| "preview".into());
    let parts: Vec<&str> = asset.split('-').collect();
    match parts.as_slice() {
        ["header"] => run(&StillImage::<3840, 1646>(Still::Header), &media),
        ["search"] => run(&StillImage::<3840, 2560>(Still::SearchResults), &media),
        ["preview"] => run(&AppPreview, &media),
        ["framed"] => run(&FramedPreview, &media),
        ["shot", size, n] => {
            let Some(still) = n.parse().ok().and_then(|n| shot(size, n)) else {
                eprintln!("unknown shot {asset}");
                return ExitCode::FAILURE;
            };
            match *size {
                "6.3" => run(&StillImage::<1206, 2622>(still), &media),
                "6.9" => run(&StillImage::<1320, 2868>(still), &media),
                "duo" => run(&StillImage::<1398, 2034>(still), &media),
                _ => ExitCode::FAILURE,
            }
        }
        _ => {
            eprintln!("unknown ASSET {asset}");
            ExitCode::FAILURE
        }
    }
}
