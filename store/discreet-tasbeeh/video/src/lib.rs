//! App Store art for Discreet Tasbeeh: still images (header, search results, captioned
//! screenshots) and the app preview video, all built from real captures of the app.
use fframes::{
    AudioMap, Color, Duration, FFramesContext, FFramesSyncedVideoFrame, Frame, Svgr,
    SyncVideoFrameInput, Transform, Video, animation::Easing,
    media::{FrameConvertOptions, ResizeVideoFrame},
};

const SERIF: &str = "Instrument Serif";
// The website's dark palette: warm off-white text and a muted warm grey.
const CREAM: &str = "#EFE9DD";
const MUTED: &str = "#8C857A";

pub const FOOTAGE: &str = "recording-30fps.mp4";
const FOOTAGE_FRAMES: usize = 534;

/// A real screenshot inside Apple's product bezel for the device it was captured on.
fn phone<'a>(ctx: &FFramesContext<'a, '_>, image: &str, x: f32, y: f32, w: f32, h: f32) -> Svgr<'a> {
    let Some(shot) = ctx.get_image(image) else { return Svgr::empty() };
    // Bezel PNG, its size, and where the screen sits in it (all in px at native screen scale).
    let (bezel, bw, bh, sx, sy, sw) = if image.starts_with("17promax") {
        ("bezel-iphone17promax-deepblue.png", 1470., 3000., 75., 66., 1320.)
    } else {
        ("bezel-iphone17-black.png", 1350., 2760., 72., 69., 1206.)
    };
    let s = w / sw;
    let frame = ctx
        .get_image(bezel)
        .map(|b| fframes::svgr!(<image href={b.href()} x={x - sx * s} y={y - sy * s} width={bw * s} height={bh * s} />))
        .unwrap_or_else(Svgr::empty);
    let id = format!("screen-{x}");
    // Rounds the corners so they stay under the bezel (its opening has a ~187 px radius).
    let r = 150. * s;
    fframes::svgr!(
        <g>
            <defs>
                <clipPath id={id.clone()}>
                    <rect x={x} y={y} width={w} height={h} rx={r} />
                </clipPath>
            </defs>
            <image href={shot.href()} x={x} y={y} width={w} height={h} clip-path={format!("url(#{id})")} preserveAspectRatio="none" />
            {frame}
        </g>
    )
}

#[derive(Debug, Clone, Copy)]
pub enum Still {
    Header,
    SearchResults,
    /// Captioned screenshot: two caption lines over a real screenshot.
    Shot { lines: [&'static str; 2], image: &'static str },
}

/// One still image at `W`x`H`; render it with `frame 0`.
#[derive(Debug)]
pub struct StillImage<const W: usize, const H: usize>(pub Still);

impl<const W: usize, const H: usize> Video for StillImage<W, H> {
    const FPS: usize = 30;
    const WIDTH: usize = W;
    const HEIGHT: usize = H;
    const BACKGROUND_COLOR: Color = Color::BLACK;

    fn duration(&self) -> Duration<'_> {
        Duration::Frames(1)
    }

    fn audio(&self) -> AudioMap<'_> {
        AudioMap::none()
    }

    fn render_frame<'a>(&'a self, _frame: Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        let (w, h) = (W as f32, H as f32);
        let body = match self.0 {
            Still::Header => header(ctx, w, h),
            Still::SearchResults => search_results(ctx, w, h),
            Still::Shot { lines, image } => shot(ctx, w, h, lines, image),
        };
        fframes::svgr!(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={format!("0 0 {W} {H}")} width={W} height={H}>
                <rect width={W} height={H} fill="#000" />
                {body}
            </svg>
        )
    }
}

/// Product page header. Apple's template keeps key art in the middle (about x 1097-2743,
/// y 493-1154 at 3840x1646), so everything sits there and only black reaches the edges.
fn header<'a>(ctx: &FFramesContext<'a, '_>, w: f32, h: f32) -> Svgr<'a> {
    let Some(digits) = ctx.get_image("digits-33.png") else { return Svgr::empty() };
    let dh = h * 0.25;
    let dw = dh * 1035. / 662.;
    let (cx, cy) = (w / 2., h * 0.45);
    fframes::svgr!(
        <g>
            <defs>
                <radialGradient id="glow" cx="0.5" cy="0.45" r="0.5">
                    <stop offset="0" stop-color="#141414" />
                    <stop offset="1" stop-color="#000" />
                </radialGradient>
            </defs>
            <rect width={w} height={h} fill="url(#glow)" />
            <image href={digits.href()} x={cx - dw / 2.} y={cy - dh / 2.} width={dw} height={dh} opacity="0.17" />
            <text x={cx} y={cy + dh / 2. + h * 0.11} font-family={SERIF} font-size={h * 0.055} fill={MUTED} text-anchor="middle">
                "Count quietly."
            </text>
        </g>
    )
}

/// Search results asset: a headline over three real screens.
fn search_results<'a>(ctx: &FFramesContext<'a, '_>, w: f32, h: f32) -> Svgr<'a> {
    let ph = h * 0.66;
    let pw = ph * 1206. / 2622.;
    let gap = w * 0.045;
    let x0 = (w - (3. * pw + 2. * gap)) / 2.;
    let top = h * 0.25;
    fframes::svgr!(
        <g>
            <text x={w / 2.} y={h * 0.165} font-family={SERIF} font-size={h * 0.062} fill={CREAM} text-anchor="middle">
                "Count quietly. No one notices."
            </text>
            {phone(ctx, "17-count7.png", x0, top, pw, ph)}
            {phone(ctx, "17-count33.png", x0 + pw + gap, top, pw, ph)}
            {phone(ctx, "17-count100.png", x0 + 2. * (pw + gap), top, pw, ph)}
        </g>
    )
}

fn shot<'a>(ctx: &FFramesContext<'a, '_>, w: f32, h: f32, lines: [&'static str; 2], image: &'static str) -> Svgr<'a> {
    // Native capture sizes: iPhone 17 Pro Max and iPhone 17.
    let (sw, sh) = if image.starts_with("17promax") { (1320., 2868.) } else { (1206., 2622.) };
    let fs = w * 0.082;
    let y1 = h * 0.085 + fs;
    let y2 = y1 + fs * 1.12;
    let top = y2 + h * 0.045;
    // The bezel adds ~2.6% above and below the screen; fit the whole phone between the margins.
    let pad = 69. / 2622.;
    let pw = (w * 0.78).min((h - top - h * 0.045) / (1. + 2. * pad) * sw / sh);
    let ph = pw * sh / sw;
    let top = top + ph * pad;
    fframes::svgr!(
        <g>
            <text x={w / 2.} y={y1} font-family={SERIF} font-size={fs} fill={CREAM} text-anchor="middle">{lines[0]}</text>
            <text x={w / 2.} y={y2} font-family={SERIF} font-size={fs} fill={CREAM} text-anchor="middle">{lines[1]}</text>
            {phone(ctx, image, (w - pw) / 2., top, pw, ph)}
        </g>
    )
}

pub const SHOTS: [(&str, [&str; 2]); 3] = [
    ("count33", ["Tap anywhere", "to count."]),
    ("count7", ["Feel each count,", "no need to look."]),
    ("count100", ["Pitch black, so", "no one notices."]),
];

/// App preview: the real screen recording with captions in the empty top of the screen.
#[derive(Debug)]
pub struct AppPreview;

pub const PREVIEW_W: usize = 886;
pub const PREVIEW_H: usize = 1920;

// (start, end, line 1, line 2) in seconds of the recording; the reset tap lands at ~15.2s.
const CAPTIONS: [(f32, f32, &str, &str); 4] = [
    (0.3, 3.9, "Tap anywhere", "to count."),
    (4.2, 8.2, "Feel each count,", "no need to look."),
    (8.5, 13.6, "Pitch black, so", "no one notices."),
    (13.9, 15.9, "Reset with", "one tap."),
];
const TITLE_AT: f32 = 16.1;

fn fade(frame: &Frame, start: f32, end: f32) -> (f32, f32) {
    let rise = frame.animate(&fframes::timeline!(at start, animate 28.0_f32 => 0.0, Easing::Spring { mass: 1.0, stiffness: 150.0, damping: 18.0 }));
    let opacity = frame.animate(&fframes::timeline!(
        at start => start + 0.45, animate 0.0_f32 => 1.0, Easing::EaseOut,
        at end - 0.25 => end, animate 1.0_f32 => 0.0, Easing::EaseIn,
    ));
    (rise, opacity)
}

impl Video for AppPreview {
    const FPS: usize = 30;
    const WIDTH: usize = PREVIEW_W;
    const HEIGHT: usize = PREVIEW_H;
    const BACKGROUND_COLOR: Color = Color::BLACK;

    fn duration(&self) -> Duration<'_> {
        // FromVideo reads the length from the audio stream, and the screen recording is silent.
        Duration::Frames(FOOTAGE_FRAMES)
    }

    fn audio(&self) -> AudioMap<'_> {
        AudioMap::none()
    }

    fn render_frame<'a>(&'a self, frame: Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        fframes::svgr!(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={format!("0 0 {PREVIEW_W} {PREVIEW_H}")} width={PREVIEW_W} height={PREVIEW_H}>
                {screen(&frame, ctx)}
            </svg>
        )
    }
}

/// The phone screen: real footage plus captions, at PREVIEW_W x PREVIEW_H.
fn screen<'a>(frame: &Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
    let (fw, fh) = (884_u32, 1920_u32);
    let footage = frame
        .get_synced_video_frame(ctx, FOOTAGE, &SyncVideoFrameInput { start_from: 0.0, looping: false, editor_fallback_image: None })
        .and_then(|f| f.into_resized_image(&FrameConvertOptions { resize: ResizeVideoFrame { width: fw, height: fh } }))
        .map(|img| fframes::svgr!(<image href={img.href()} x={(PREVIEW_W as u32 - fw) / 2} y="0" width={fw} height={fh} />))
        .unwrap_or_else(Svgr::empty);

    let t = frame.seconds();
    let cx = PREVIEW_W as f32 / 2.;
    let fs = 68.;
    let captions: Vec<Svgr> = CAPTIONS
        .iter()
        .filter(|(start, end, ..)| t >= *start - 0.05 && t <= *end + 0.05)
        .map(|&(start, end, a, b)| {
            let (rise, opacity) = fade(frame, start, end);
            fframes::svgr!(
                <g opacity={opacity} transform={Transform::translate(0, rise)}>
                    <text x={cx} y="360" font-family={SERIF} font-size={fs} fill={CREAM} text-anchor="middle">{a}</text>
                    <text x={cx} y={360. + fs * 1.12} font-family={SERIF} font-size={fs} fill={CREAM} text-anchor="middle">{b}</text>
                </g>
            )
        })
        .collect();

    let title = if t >= TITLE_AT - 0.05 {
        let (rise, opacity) = fade(frame, TITLE_AT, 999.);
        fframes::svgr!(
            <g opacity={opacity} transform={Transform::translate(0, rise)}>
                <text x={cx} y="380" font-family={SERIF} font-size="84" fill={CREAM} text-anchor="middle">"Discreet Tasbeeh"</text>
                <text x={cx} y="450" font-family={SERIF} font-size="44" fill={MUTED} text-anchor="middle">"Count quietly."</text>
            </g>
        )
    } else {
        Svgr::empty()
    };

    fframes::svgr!(
        <g>
            <rect width={PREVIEW_W} height={PREVIEW_H} fill="#000" />
            {footage}
            {captions}
            {title}
        </g>
    )
}

// Apple's iPhone 17 bezel: 1350x2760 with the 1206x2622 screen at (72, 69).
const BEZEL_SCALE: f32 = PREVIEW_W as f32 / 1206.;
// Rounds the screen's corners so they stay under the bezel (its opening has a ~187 px radius).
const SCREEN_RADIUS: f32 = 150.;
pub const FRAMED_W: usize = 992;
pub const FRAMED_H: usize = 2028;
// The website card colour; keep in sync with `tint` in src/data/apps.ts.
const TINT: &str = "#dcebdc";

/// The same preview inside a real iPhone frame on the card colour, for the website.
#[derive(Debug)]
pub struct FramedPreview;

impl Video for FramedPreview {
    const FPS: usize = 30;
    const WIDTH: usize = FRAMED_W;
    const HEIGHT: usize = FRAMED_H;
    const BACKGROUND_COLOR: Color = Color::BLACK;

    fn duration(&self) -> Duration<'_> {
        Duration::Frames(FOOTAGE_FRAMES)
    }

    fn audio(&self) -> AudioMap<'_> {
        AudioMap::none()
    }

    fn render_frame<'a>(&'a self, frame: Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        let s = BEZEL_SCALE;
        let (x, y) = (72. * s, 69. * s);
        let bezel = ctx
            .get_image("bezel-iphone17-black.png")
            .map(|b| fframes::svgr!(<image href={b.href()} x="0" y="0" width={1350. * s} height={2760. * s} />))
            .unwrap_or_else(Svgr::empty);
        fframes::svgr!(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={format!("0 0 {FRAMED_W} {FRAMED_H}")} width={FRAMED_W} height={FRAMED_H}>
                <rect width={FRAMED_W} height={FRAMED_H} fill={TINT} />
                <defs>
                    <clipPath id="screen">
                        <rect x={x} y={y} width={1206. * s} height={2622. * s} rx={SCREEN_RADIUS * s} />
                    </clipPath>
                </defs>
                <g clip-path="url(#screen)">
                    <rect x={x} y={y} width={1206. * s} height={2622. * s} fill="#000" />
                    <g transform={Transform::translate(x, y)}>{screen(&frame, ctx)}</g>
                </g>
                {bezel}
            </svg>
        )
    }
}
