use fframes::{EncoderOptions, MediaDirectory, RenderOptions, Video, cli};
use fframes_skia_renderer::{SkiaFFramesRenderer, SkiaPipelineConcurrencyPolicy, SkiaPipelineConfig, metal::SkiaMetalCtx};
use std::process::ExitCode;
use video::{AppPreview, FramedPreview};

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

/// `VARIANT=framed` renders the preview inside a real iPhone frame for the website.
fn main() -> ExitCode {
    let dir = MediaDirectory::read_folder("assets").expect("assets folder");
    let media = dir.process_media_source().expect("media");
    match std::env::var("VARIANT").as_deref() {
        Ok("framed") => run(&FramedPreview, &media),
        _ => run(&AppPreview, &media),
    }
}
