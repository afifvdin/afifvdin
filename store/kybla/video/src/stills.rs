//! App Store stills: header, search results and captioned screenshots, built from real
//! simulator captures inside Apple's bezels.
use super::{INK, PAPER, SERIF};
use fframes::{AudioMap, Color, Duration, FFramesContext, Frame, Svgr, Video};

const HEADLINE: &str = "Find the Qibla, anywhere.";

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
                <rect width={W} height={H} fill={PAPER} />
                {body}
            </svg>
        )
    }
}

/// Product page header. Apple's template keeps key art in the middle (about x 1097-2743,
/// y 493-1154 at 3840x1646), so the icon's tilted arrow and the headline sit there.
fn header<'a>(ctx: &FFramesContext<'a, '_>, w: f32, h: f32) -> Svgr<'a> {
    let Some(arrow) = ctx.get_image("arrow.png") else { return Svgr::empty() };
    let ah = h * 0.22;
    let aw = ah * 166. / 178.;
    let (cx, cy) = (w / 2., h * 0.41);
    // Tilted 25° like the app icon: from Indonesia the Qibla is west, a little right.
    fframes::svgr!(
        <g>
            <g transform={format!("rotate(25 {cx} {cy})")}>
                <image href={arrow.href()} x={cx - aw / 2.} y={cy - ah / 2.} width={aw} height={ah} />
            </g>
            <text x={cx} y={h * 0.655} font-family={SERIF} font-size={h * 0.07} fill={INK} text-anchor="middle">{HEADLINE}</text>
        </g>
    )
}

/// Search results asset: a headline over three real screens.
fn search_results<'a>(ctx: &FFramesContext<'a, '_>, w: f32, h: f32) -> Svgr<'a> {
    let ph = h * 0.64;
    let pw = ph * 1206. / 2622.;
    let gap = w * 0.06;
    let x0 = (w - (3. * pw + 2. * gap)) / 2.;
    let top = h * 0.27;
    fframes::svgr!(
        <g>
            <text x={w / 2.} y={h * 0.165} font-family={SERIF} font-size={h * 0.07} fill={INK} text-anchor="middle">{HEADLINE}</text>
            {phone(ctx, "17-jakarta.png", x0, top, pw, ph)}
            {phone(ctx, "17-london.png", x0 + pw + gap, top, pw, ph)}
            {phone(ctx, "17-aligned.png", x0 + 2. * (pw + gap), top, pw, ph)}
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
            <text x={w / 2.} y={y1} font-family={SERIF} font-size={fs} fill={INK} text-anchor="middle">{lines[0]}</text>
            <text x={w / 2.} y={y2} font-family={SERIF} font-size={fs} fill={INK} text-anchor="middle">{lines[1]}</text>
            {phone(ctx, image, (w - pw) / 2., top, pw, ph)}
        </g>
    )
}

/// The three selling points, one per screenshot, with the capture each sits on.
pub const SHOTS: [(&str, [&str; 2]); 3] = [
    ("jakarta", ["The arrow points", "to the Qibla."]),
    ("london", ["A compass ring", "that turns with you."]),
    ("aligned", ["A gentle tap", "when you're facing it."]),
];
