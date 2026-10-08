//! Kibla preview: the app's screen (arrow, compass ring, degrees off) recreated at iPhone 17
//! Pro Max proportions, with the phone turning toward the Qibla, and captions in the top of the screen.
use fframes::{AudioMap, Color, Duration, FFramesContext, Frame, Svgr, Transform, Video, animation::Easing};

const SERIF: &str = "Instrument Serif";
const MONO: &str = "SF Mono";
// The app's colours: terracotta ink on a pastel peach page, letters at 45%.
const PAPER: &str = "#F8E1CF";
const INK: &str = "#8A3B14";
const SECONDARY: f32 = 0.45;
// Jakarta, so the heading behind each offset is a real one.
const QIBLA: f32 = 295.;

pub const W: usize = 886;
pub const H: usize = 1920;
// 1320 px wide screen at 3x = 440 pt.
const PT: f32 = W as f32 / 440.;

// (start, end, line 1, line 2) in seconds.
const CAPTIONS: [(f32, f32, &str, &str); 3] = [
    (0.3, 4.4, "The arrow points", "to the Qibla."),
    (4.7, 8.6, "Turn until it", "points straight up."),
    (8.9, 12.6, "A gentle tap", "when you're facing it."),
];
const TITLE_AT: f32 = 12.9;
const LENGTH: f32 = 16.0;

// Degrees from where the phone points to the Qibla, as the phone is turned.
// Eased between keyframes, with a small wobble from the hand until it settles.
const PATH: [(f32, f32); 9] = [
    (0.0, 118.),
    (1.4, 84.),
    (2.3, 97.),
    (3.8, 52.),
    (5.2, 31.),
    (6.4, 9.),
    (7.3, -6.),
    (8.0, 2.),
    (8.6, 0.),
];

fn offset(t: f32) -> f32 {
    let i = PATH.iter().rposition(|(at, _)| *at <= t).unwrap_or(0);
    let Some(&(t1, b)) = PATH.get(i + 1) else { return PATH[PATH.len() - 1].1 };
    let (t0, a) = PATH[i];
    let x = ((t - t0) / (t1 - t0)).clamp(0., 1.);
    let eased = x * x * (3. - 2. * x);
    let settle = (1. - (t / 8.6)).clamp(0., 1.);
    a + (b - a) * eased + (t * 9.).sin() * 1.6 * settle
}

fn fade(frame: &Frame, start: f32, end: f32) -> (f32, f32) {
    let rise = frame.animate(&fframes::timeline!(at start, animate 28.0_f32 => 0.0, Easing::Spring { mass: 1.0, stiffness: 150.0, damping: 18.0 }));
    let opacity = frame.animate(&fframes::timeline!(
        at start => start + 0.45, animate 0.0_f32 => 1.0, Easing::EaseOut,
        at end - 0.25 => end, animate 1.0_f32 => 0.0, Easing::EaseIn,
    ));
    (rise, opacity)
}

#[derive(Debug)]
pub struct AppPreview;

impl Video for AppPreview {
    const FPS: usize = 30;
    const WIDTH: usize = W;
    const HEIGHT: usize = H;
    const BACKGROUND_COLOR: Color = Color::BLACK;

    fn duration(&self) -> Duration<'_> {
        Duration::Seconds(LENGTH)
    }

    fn audio(&self) -> AudioMap<'_> {
        AudioMap::none()
    }

    fn render_frame<'a>(&'a self, frame: Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        let screen = screen(&frame, ctx);
        fframes::svgr!(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={format!("0 0 {W} {H}")} width={W} height={H}>
                {screen}
            </svg>
        )
    }
}

/// The phone screen at `W`x`H`.
fn screen<'a>(frame: &Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        let t = frame.seconds();
        let cx = W as f32 / 2.;

        // Positions in points, measured from a simulator capture.
        let off = offset(t);
        let (aw, ah) = (166. * PT, 178. * PT);
        let (ax, ay) = (cx, 444. * PT);
        // The ring shows true directions, so it turns against the phone's heading.
        let dial = off - QIBLA;
        let letters: Vec<Svgr> = ["N", "E", "S", "W"]
            .iter()
            .enumerate()
            .map(|(i, letter)| {
                let a = (dial + i as f32 * 90.).to_radians();
                let (x, y) = (ax + 150. * PT * a.sin(), ay - 150. * PT * a.cos());
                fframes::svgr!(
                    <text x={x} y={y + 7.7 * PT} font-family={MONO} font-weight="700" font-size={22. * PT} fill={INK} opacity={SECONDARY} text-anchor="middle">{*letter}</text>
                )
            })
            .collect();
        let arrow = ctx
            .get_image("arrow.png")
            .map(|img| {
                fframes::svgr!(
                    <g transform={format!("rotate({off} {ax} {ay})")}>
                        <image href={img.href()} x={ax - aw / 2.} y={ay - ah / 2.} width={aw} height={ah} />
                    </g>
                )
            })
            .unwrap_or_else(Svgr::empty);
        let (bw, bh) = (27. * PT, 25. * PT);
        let bubble = ctx
            .get_image("bubble.png")
            .map(|img| fframes::svgr!(<image href={img.href()} x={409. * PT - bw / 2.} y={90. * PT - bh / 2.} width={bw} height={bh} opacity={SECONDARY} />))
            .unwrap_or_else(Svgr::empty);
        let degrees = format!("{}°", off.abs().round() as i32);

        let captions: Vec<Svgr> = CAPTIONS
            .iter()
            .filter(|(start, end, ..)| t >= *start - 0.05 && t <= *end + 0.05)
            .map(|&(start, end, a, b)| {
                let (rise, opacity) = fade(frame, start, end);
                fframes::svgr!(
                    <g opacity={opacity} transform={Transform::translate(0, rise)}>
                        <text x={cx} y="360" font-family={SERIF} font-size="68" fill={INK} text-anchor="middle">{a}</text>
                        <text x={cx} y={360. + 68. * 1.12} font-family={SERIF} font-size="68" fill={INK} text-anchor="middle">{b}</text>
                    </g>
                )
            })
            .collect();

        let title = if t >= TITLE_AT - 0.05 {
            let (rise, opacity) = fade(frame, TITLE_AT, 999.);
            fframes::svgr!(
                <g opacity={opacity} transform={Transform::translate(0, rise)}>
                    <text x={cx} y="380" font-family={SERIF} font-size="84" fill={INK} text-anchor="middle">"Kibla"</text>
                    <text x={cx} y="450" font-family={SERIF} font-size="44" fill={INK} opacity={SECONDARY} text-anchor="middle">"Find the Qibla, anywhere."</text>
                </g>
            )
        } else {
            Svgr::empty()
        };

        fframes::svgr!(
            <g>
                <rect width={W} height={H} fill={PAPER} />
                {bubble}
                {letters}
                {arrow}
                <text x={cx} y={695.3 * PT} font-family={MONO} font-weight="700" font-size={40. * PT} fill={INK} text-anchor="middle">{degrees}</text>
                {captions}
                {title}
            </g>
        )
}

// Apple's iPhone 17 bezel: 1350x2760 with the 1206x2622 screen at (72, 69).
const BEZEL_SCALE: f32 = W as f32 / 1206.;
// Rounds the screen's corners so they stay under the bezel (its opening has a ~187 px radius).
const SCREEN_RADIUS: f32 = 150.;
pub const FRAMED_W: usize = 992;
pub const FRAMED_H: usize = 2028;
// The website card colour, so the video sits on its card seamlessly.
const TINT: &str = "#f8e1cf";

/// The same preview inside a real iPhone frame, for the website.
#[derive(Debug)]
pub struct FramedPreview;

impl Video for FramedPreview {
    const FPS: usize = 30;
    const WIDTH: usize = FRAMED_W;
    const HEIGHT: usize = FRAMED_H;
    const BACKGROUND_COLOR: Color = Color::BLACK;

    fn duration(&self) -> Duration<'_> {
        Duration::Seconds(LENGTH)
    }

    fn audio(&self) -> AudioMap<'_> {
        AudioMap::none()
    }

    fn render_frame<'a>(&'a self, frame: Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        let s = BEZEL_SCALE;
        let (x, y) = (72. * s, 69. * s);
        let screen = screen(&frame, ctx);
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
                    <rect x={x} y={y} width={1206. * s} height={2622. * s} fill={PAPER} />
                    <g transform={Transform::translate(x, y)}>{screen}</g>
                </g>
                {bezel}
            </svg>
        )
    }
}
