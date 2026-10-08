//! QProfiler preview: real screenshots of the app in a Mac window on the card colour, with the
//! camera easing into the details that matter and captions above the window.
use fframes::{AudioMap, Color, Duration, FFramesContext, Frame, Svgr, Transform, Video, animation::Easing};

const SERIF: &str = "Instrument Serif";
// The website card colour, so the video sits on its card seamlessly.
const TINT: &str = "#dfe8f1";
const INK: &str = "#26405c";
const CORAL: &str = "#e07a4f";

pub const W: usize = 1800;
pub const H: usize = 1200;

// Screenshots are 1500x1000 window captures (transparent rounded corners).
const SRC_W: f32 = 1500.;
const SRC_H: f32 = 1000.;
const FIT: f32 = 0.94;
const WIN_W: f32 = SRC_W * FIT;
const WIN_H: f32 = SRC_H * FIT;
const WIN_X: f32 = (W as f32 - WIN_W) / 2.;
const WIN_Y: f32 = 214.;
const WIN_R: f32 = 26. * FIT;
const CAPTION_Y: f32 = 140.;

/// A camera stop: at `t` seconds into the shot, centre on (x, y) in screenshot pixels at `zoom`.
#[derive(Clone, Copy)]
struct Stop {
    t: f32,
    x: f32,
    y: f32,
    zoom: f32,
}

const fn stop(t: f32, x: f32, y: f32, zoom: f32) -> Stop {
    Stop { t, x, y, zoom }
}

const FULL_X: f32 = SRC_W / 2.;
const FULL_Y: f32 = SRC_H / 2.;

struct Shot {
    image: &'static str,
    start: f32,
    end: f32,
    camera: &'static [Stop],
    /// (start, end, text) in seconds from the start of the video.
    captions: &'static [(f32, f32, &'static str)],
}

const SHOTS: [Shot; 5] = [
    // Plan tree, then the misestimate badges in rows est -> actual.
    Shot {
        image: "plan.png",
        start: 0.0,
        end: 5.6,
        camera: &[stop(0.0, FULL_X, FULL_Y, 1.0), stop(2.5, FULL_X, FULL_Y, 1.0), stop(3.7, 760., 560., 1.5)],
        captions: &[(0.3, 2.6, "See where a slow query spends its time."), (2.9, 5.3, "And where the planner guessed wrong.")],
    },
    // The sort that spills: temp written tile and the disk badge.
    Shot {
        image: "spill.png",
        start: 5.6,
        end: 9.0,
        camera: &[stop(0.0, 760., 620., 1.6)],
        captions: &[(5.9, 8.7, "Sorts that spill to disk stand out.")],
    },
    // Compare: worst misestimate 2,002x -> 196x.
    Shot {
        image: "compare.png",
        start: 9.0,
        end: 12.8,
        camera: &[stop(0.0, FULL_X, FULL_Y, 1.0), stop(0.9, FULL_X, FULL_Y, 1.0), stop(2.0, 865., 250., 1.2)],
        captions: &[(9.3, 12.5, "Compare two runs side by side.")],
    },
    // Workload from pg_stat_statements.
    Shot {
        image: "workload.png",
        start: 12.8,
        end: 16.2,
        camera: &[stop(0.0, FULL_X, FULL_Y, 1.0)],
        captions: &[(13.1, 15.9, "The whole workload, ranked by time.")],
    },
    // TigerGraph: profiler peak 1 MB vs true peak +34 MB, then the memory chart.
    Shot {
        image: "tg-profile.png",
        start: 16.2,
        end: 22.0,
        camera: &[
            stop(0.0, FULL_X, FULL_Y, 1.0),
            stop(0.9, FULL_X, FULL_Y, 1.0),
            stop(2.0, 858., 600., 2.0),
            stop(4.5, 858., 600., 2.0),
            stop(5.6, 640., 720., 1.5),
        ],
        captions: &[(16.5, 18.9, "On TigerGraph, the profiler says 1 MB."), (19.2, 21.7, "The process really grew 34 MB.")],
    },
];

const CROSSFADE: f32 = 0.5;
const TITLE_AT: f32 = 22.0;
const LENGTH: f32 = 25.5;

fn ease_in_out(x: f32) -> f32 {
    let x = x.clamp(0., 1.);
    if x < 0.5 { 4. * x * x * x } else { 1. - (-2. * x + 2.).powi(3) / 2. }
}

/// Camera at `t` seconds into the shot, clamped so the screenshot always fills the window.
fn camera(stops: &[Stop], t: f32) -> (f32, f32, f32) {
    let i = stops.iter().rposition(|s| s.t <= t).unwrap_or(0);
    let a = stops[i];
    let (x, y, zoom) = match stops.get(i + 1) {
        Some(b) => {
            let p = ease_in_out((t - a.t) / (b.t - a.t));
            (a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, a.zoom + (b.zoom - a.zoom) * p)
        }
        None => (a.x, a.y, a.zoom),
    };
    let (hw, hh) = (SRC_W / 2. / zoom, SRC_H / 2. / zoom);
    (x.clamp(hw, SRC_W - hw), y.clamp(hh, SRC_H - hh), zoom)
}

fn fade(frame: &Frame, start: f32, end: f32) -> (f32, f32) {
    let rise = frame.animate(&fframes::timeline!(at start, animate 24.0_f32 => 0.0, Easing::Spring { mass: 1.0, stiffness: 150.0, damping: 18.0 }));
    let opacity = frame.animate(&fframes::timeline!(
        at start => start + 0.45, animate 0.0_f32 => 1.0, Easing::EaseOut,
        at end - 0.25 => end, animate 1.0_f32 => 0.0, Easing::EaseIn,
    ));
    (rise, opacity)
}

fn shot_layer<'a>(shot: &Shot, t: f32, opacity: f32, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
    let Some(img) = ctx.get_image(shot.image) else { return Svgr::empty() };
    let (cx, cy, zoom) = camera(shot.camera, (t - shot.start).max(0.));
    let s = FIT * zoom;
    let tx = WIN_X + WIN_W / 2. - cx * s;
    let ty = WIN_Y + WIN_H / 2. - cy * s;
    fframes::svgr!(
        <g opacity={opacity} transform={format!("translate({tx} {ty}) scale({s})")}>
            <image href={img.href()} x="0" y="0" width={SRC_W} height={SRC_H} />
        </g>
    )
}

fn captions<'a>(frame: &Frame, t: f32) -> Vec<Svgr<'a>> {
    SHOTS
        .iter()
        .flat_map(|s| s.captions.iter())
        .filter(|(start, end, _)| t >= *start - 0.05 && t <= *end + 0.05)
        .map(|&(start, end, text)| {
            let (rise, opacity) = fade(frame, start, end);
            fframes::svgr!(
                <g opacity={opacity} transform={Transform::translate(0, rise)}>
                    <text x={W as f32 / 2.} y={CAPTION_Y} font-family={SERIF} font-size="72" fill={INK} text-anchor="middle">{text}</text>
                </g>
            )
        })
        .collect()
}

/// The app icon's plan tree, drawn at `size` px centred on (cx, cy).
fn icon<'a>(cx: f32, cy: f32, size: f32) -> Svgr<'a> {
    let s = size / 1024.;
    fframes::svgr!(
        <g transform={format!("translate({} {}) scale({s})", cx - size / 2., cy - size / 2.)}>
            <rect width="1024" height="1024" rx="230" fill="#eef3f8" filter="url(#icon-shadow)" />
            <g transform="translate(512 512) scale(0.82) translate(-512 -496)">
                <g fill="none" stroke={INK} stroke-width="44" stroke-linecap="round">
                    <line x1="469" y1="398" x2="373" y2="588" />
                    <line x1="555" y1="398" x2="651" y2="588" />
                    <circle cx="512" cy="318" r="86" />
                    <circle cx="334" cy="668" r="86" />
                </g>
                <circle cx="690" cy="668" r="108" fill={CORAL} />
            </g>
        </g>
    )
}

fn scene<'a>(frame: &Frame, t: f32, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
    // The window leaves as the title arrives.
    let window_out = frame.animate(&fframes::timeline!(at TITLE_AT - 0.1 => TITLE_AT + 0.5, animate 1.0_f32 => 0.0, Easing::EaseIn));
    let window_drop = frame.animate(&fframes::timeline!(at TITLE_AT - 0.1 => TITLE_AT + 0.5, animate 0.0_f32 => 30.0, Easing::EaseIn));

    let mut layers: Vec<Svgr> = Vec::new();
    for (i, shot) in SHOTS.iter().enumerate() {
        let next_start = SHOTS.get(i + 1).map(|n| n.start);
        let visible_until = next_start.map(|n| n + CROSSFADE).unwrap_or(shot.end + 1.);
        if t < shot.start || t > visible_until {
            continue;
        }
        // Each shot fades in over the previous one, which stays underneath until it's covered.
        let opacity = if i == 0 { 1. } else { ((t - shot.start) / CROSSFADE).clamp(0., 1.) };
        layers.push(shot_layer(shot, t, ease_in_out(opacity), ctx));
    }

    let window = if window_out > 0.001 {
        fframes::svgr!(
            <g opacity={window_out} transform={Transform::translate(0, window_drop)}>
                <rect x={WIN_X} y={WIN_Y} width={WIN_W} height={WIN_H} rx={WIN_R} fill="#ffffff" filter="url(#window-shadow)" />
                <g clip-path="url(#window)">{layers}</g>
                <rect x={WIN_X + 0.5} y={WIN_Y + 0.5} width={WIN_W - 1.} height={WIN_H - 1.} rx={WIN_R} fill="none" stroke="rgba(38,64,92,0.12)" stroke-width="1" />
            </g>
        )
    } else {
        Svgr::empty()
    };

    let title = if t >= TITLE_AT - 0.05 {
        let (rise, opacity) = fade(frame, TITLE_AT + 0.2, 999.);
        let (rise2, opacity2) = fade(frame, TITLE_AT + 0.45, 999.);
        let cx = W as f32 / 2.;
        fframes::svgr!(
            <g>
                <g opacity={opacity} transform={Transform::translate(0, rise)}>
                    {icon(cx, 440., 220.)}
                    <text x={cx} y="700" font-family={SERIF} font-size="128" fill={INK} text-anchor="middle">"QProfiler"</text>
                </g>
                <g opacity={opacity2} transform={Transform::translate(0, rise2)}>
                    <text x={cx} y="790" font-family={SERIF} font-size="56" fill={INK} opacity="0.55" text-anchor="middle">"How heavy is that query?"</text>
                </g>
            </g>
        )
    } else {
        Svgr::empty()
    };

    let captions = captions(frame, t);
    fframes::svgr!(
        <g>
            <defs>
                <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#e7eef5" />
                    <stop offset="1" stop-color={TINT} />
                </linearGradient>
                <clipPath id="window">
                    <rect x={WIN_X} y={WIN_Y} width={WIN_W} height={WIN_H} rx={WIN_R} />
                </clipPath>
                <filter id="window-shadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#26405c" flood-opacity="0.2" />
                </filter>
                <filter id="icon-shadow" x="-20%" y="-20%" width="140%" height="150%">
                    <feDropShadow dx="0" dy="30" stdDeviation="36" flood-color="#26405c" flood-opacity="0.18" />
                </filter>
            </defs>
            <rect width={W} height={H} fill="url(#paper)" />
            {window}
            {captions}
            {title}
        </g>
    )
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
        let t = frame.seconds();
        let scene = scene(&frame, t, ctx);
        fframes::svgr!(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={format!("0 0 {W} {H}")} width={W} height={H}>
                {scene}
            </svg>
        )
    }
}
