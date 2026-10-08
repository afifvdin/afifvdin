//! Kave preview: a code editor on a warm desktop, and kave's keycaps showing each shortcut as
//! it happens. The shortcuts really edit the code (delete a line, undo, move it, find, save),
//! and the keycaps copy the app: same proportions, colours, springs and timings.
use fframes::{AudioMap, Color, Duration, FFramesContext, Frame, Svgr, Video};

pub const W: usize = 1800;
pub const H: usize = 1200;
const LENGTH: f32 = 12.4;

const ROUNDED: &str = "SF Pro Rounded";
const MONO: &str = "SF Mono";

// ---------------------------------------------------------------------------------------------
// Motion, matching the app

/// The app's CASpringAnimation: mass 1, stiffness 420, damping 18. Goes 0 -> 1 with a small
/// overshoot.
fn spring(t: f32) -> f32 {
    if t <= 0. {
        return 0.;
    }
    let w0 = 420f32.sqrt();
    let zeta = 18. / (2. * w0);
    let wd = w0 * (1. - zeta * zeta).sqrt();
    1. - (-zeta * w0 * t).exp() * ((wd * t).cos() + zeta * w0 / wd * (wd * t).sin())
}

/// cubic-bezier(x1, y1, x2, y2) at progress `x`.
fn bezier(x: f32, x1: f32, y1: f32, x2: f32, y2: f32) -> f32 {
    let x = x.clamp(0., 1.);
    let curve = |t: f32, a: f32, b: f32| 3. * (1. - t) * (1. - t) * t * a + 3. * (1. - t) * t * t * b + t * t * t;
    let (mut lo, mut hi) = (0., 1.);
    for _ in 0..24 {
        let mid = (lo + hi) / 2.;
        if curve(mid, x1, x2) < x { lo = mid } else { hi = mid }
    }
    curve((lo + hi) / 2., y1, y2)
}

/// The app's layout transition: 0.24 s, cubic-bezier(0.2, 0.9, 0.25, 1).
fn slide(t: f32) -> f32 {
    bezier(t / 0.24, 0.2, 0.9, 0.25, 1.0)
}

fn ease_out(t: f32, duration: f32) -> f32 {
    let x = (t / duration).clamp(0., 1.);
    1. - (1. - x).powi(3)
}

fn ease_in(t: f32, duration: f32) -> f32 {
    let x = (t / duration).clamp(0., 1.);
    x * x * x
}

// ---------------------------------------------------------------------------------------------
// Keycaps

/// Keycap height; the rest scales with it, as in the app.
const KH: f32 = 96.;
const PAD: f32 = 0.2 * KH;
const GAP: f32 = 0.1 * KH;
const RADIUS: f32 = 0.2 * KH;
const DEPTH: f32 = 0.13 * KH;
const TRAVEL: f32 = 0.08 * KH;
const INSET: f32 = 0.055 * KH;
const TOP: f32 = 0.03 * KH;
const LPAD: f32 = 0.11 * KH;
const FACE_H: f32 = KH - DEPTH - TOP;
const TRAY_H: f32 = KH + 2. * PAD;
const TRAY_TOP: f32 = 948.;
const BADGE_H: f32 = 0.4 * KH;

// The dark palette (kave's src/theme.rs).
const ACCENT: &str = "#ff6b3d";
const ACCENT_SKIRT: &str = "#9e4226";
const ACCENT_PRESSED: &str = "#e05e36";
const SKIRT: &str = "#121214";
const FACE: &str = "#333338";
const FACE_PRESSED: &str = "#29292e";
const LEGEND: &str = "#f5f5f7";
const NAME: &str = "#a3a3ad";

#[derive(Clone, Copy)]
struct Key {
    legend: &'static str,
    name: Option<&'static str>,
    units: f32,
    accent: bool,
}

const fn key(legend: &'static str) -> Key {
    Key { legend, name: None, units: 1., accent: false }
}
const CMD: Key = Key { legend: "⌘", name: Some("command"), units: 1.5, accent: false };
const SHIFT: Key = Key { legend: "⇧", name: Some("shift"), units: 1.75, accent: false };
const OPT: Key = Key { legend: "⌥", name: Some("option"), units: 1.5, accent: false };
const ESC: Key = Key { legend: "", name: Some("esc"), units: 1.25, accent: true };

impl Key {
    fn width(&self) -> f32 {
        (self.units * KH + (self.units - 1.) * GAP).round()
    }
}

/// A keycap in a shot: where it sits in the row, when it appears and when it's held down.
struct Cap {
    key: Key,
    slot: usize,
    appear: f32,
    presses: &'static [(f32, f32)],
}

/// One shortcut on screen, from its first key to its fade-out.
struct Shot {
    caps: &'static [Cap],
    /// (time, count) for the repeat badge.
    badges: &'static [(f32, u32)],
    /// When the fade-out starts (the app's hide_after after the last key).
    leave: f32,
}

const SHOTS: &[Shot] = &[
    // ⌘ ⇧ K: delete the line. The ⌘ preview grows into the full shortcut.
    Shot {
        caps: &[
            Cap { key: SHIFT, slot: 0, appear: 0.62, presses: &[(0.62, 1.10)] },
            Cap { key: CMD, slot: 1, appear: 0.50, presses: &[(0.50, 1.18)] },
            Cap { key: key("K"), slot: 2, appear: 0.80, presses: &[(0.80, 0.94)] },
        ],
        badges: &[],
        leave: 1.95,
    },
    // ⌘ Z: undo.
    Shot {
        caps: &[
            Cap { key: CMD, slot: 0, appear: 2.40, presses: &[(2.40, 2.82)] },
            Cap { key: key("Z"), slot: 1, appear: 2.56, presses: &[(2.56, 2.69)] },
        ],
        badges: &[],
        leave: 3.50,
    },
    // ⌥ ↑ twice: move the line up.
    Shot {
        caps: &[
            Cap { key: OPT, slot: 0, appear: 3.80, presses: &[(3.80, 4.62)] },
            Cap { key: key("↑"), slot: 1, appear: 3.98, presses: &[(3.98, 4.09), (4.34, 4.45)] },
        ],
        badges: &[(4.34, 2)],
        leave: 5.20,
    },
    // ⌘ F: find.
    Shot {
        caps: &[
            Cap { key: CMD, slot: 0, appear: 5.55, presses: &[(5.55, 5.95)] },
            Cap { key: key("F"), slot: 1, appear: 5.70, presses: &[(5.70, 5.82)] },
        ],
        badges: &[],
        leave: 6.80,
    },
    // esc: close find. The accent keycap.
    Shot {
        caps: &[Cap { key: ESC, slot: 0, appear: 7.40, presses: &[(7.40, 7.56)] }],
        badges: &[],
        leave: 8.15,
    },
    // ⌥ ↓ twice: move it back.
    Shot {
        caps: &[
            Cap { key: OPT, slot: 0, appear: 8.45, presses: &[(8.45, 9.25)] },
            Cap { key: key("↓"), slot: 1, appear: 8.62, presses: &[(8.62, 8.73), (8.98, 9.09)] },
        ],
        badges: &[(8.98, 2)],
        leave: 9.90,
    },
    // ⌘ S: save.
    Shot {
        caps: &[
            Cap { key: CMD, slot: 0, appear: 10.15, presses: &[(10.15, 10.55)] },
            Cap { key: key("S"), slot: 1, appear: 10.30, presses: &[(10.30, 10.42)] },
        ],
        badges: &[],
        leave: 11.30,
    },
];

const FADE_IN: f32 = 0.1;
const FADE_OUT: f32 = 0.25;

fn badge_width(count: u32) -> f32 {
    let chars = format!("×{count}").chars().count() as f32;
    (chars * 0.6 * 0.22 * KH + 0.3 * KH).max(BADGE_H).round()
}

/// Positions of the visible caps (by slot) and the badge, centered on the canvas, at one layout.
struct Layout {
    left: f32,
    width: f32,
    caps: Vec<(usize, f32)>,
    badge: Option<f32>,
}

fn layout(shot: &Shot, at: f32) -> Layout {
    let mut caps: Vec<&Cap> = shot.caps.iter().filter(|c| c.appear <= at + 1e-4).collect();
    caps.sort_by_key(|c| c.slot);
    let badge = shot.badges.iter().rev().find(|(t, _)| *t <= at + 1e-4).map(|&(_, n)| n);
    let mut x = 0.;
    let mut placed = Vec::new();
    for (i, cap) in caps.iter().enumerate() {
        if i > 0 {
            x += GAP;
        }
        placed.push((cap.slot, x));
        x += cap.key.width();
    }
    let badge_x = badge.map(|n| {
        x += GAP;
        let bx = x;
        x += badge_width(n);
        bx
    });
    let width = x + 2. * PAD;
    let left = ((W as f32 - width) / 2.).round();
    Layout {
        left,
        width,
        caps: placed.into_iter().map(|(s, x)| (s, left + PAD + x)).collect(),
        badge: badge_x.map(|bx| left + PAD + bx),
    }
}

/// Every moment the row's layout changes, with the layout from then on.
fn layouts(shot: &Shot) -> Vec<(f32, Layout)> {
    let mut times: Vec<f32> = shot.caps.iter().map(|c| c.appear).chain(shot.badges.iter().map(|b| b.0)).collect();
    times.sort_by(|a, b| a.partial_cmp(b).unwrap());
    times.dedup();
    times.into_iter().map(|t| (t, layout(shot, t))).collect()
}

/// A value that slides between layouts, starting from the layout where it first exists.
fn slid(t: f32, values: &[(f32, Option<f32>)]) -> Option<f32> {
    let mut current: Option<f32> = None;
    for (i, &(at, value)) in values.iter().enumerate() {
        if at > t {
            break;
        }
        let Some(v) = value else { continue };
        match current {
            None => current = Some(v),
            Some(c) => {
                let prev = values[..i].iter().rev().find_map(|(_, v)| *v).unwrap_or(v);
                current = Some(c + (v - prev) * slide(t - at));
            }
        }
    }
    current
}

/// How far a face has sunk: quick 0.05 s press, springy release.
fn press_depth(t: f32, presses: &[(f32, f32)]) -> (f32, bool) {
    let Some(&(down, up)) = presses.iter().rev().find(|(down, _)| *down <= t) else { return (0., false) };
    if t < up {
        (TRAVEL * ease_out(t - down, 0.05), true)
    } else {
        (TRAVEL * (1. - spring(t - up)), false)
    }
}

fn cap_svg<'a>(cap: &Cap, x: f32, t: f32) -> Svgr<'a> {
    let w = cap.key.width();
    let (sink, held) = press_depth(t, cap.presses);
    let since = t - cap.appear;
    // Drops into place: scale 0.6 -> 1 and down from 0.35 KH above, fading in over 0.12 s.
    let scale = 0.6 + 0.4 * spring(since);
    let drop = -0.35 * KH * (1. - spring(since));
    let opacity = ease_out(since, 0.12);
    let (cx, cy) = (x + w / 2., TRAY_TOP + PAD + KH / 2.);
    let transform = format!("translate({} {}) scale({scale}) translate({} {})", cx, cy + drop, -cx, -cy);

    let (skirt, face) = match (cap.key.accent, held) {
        (true, false) => (ACCENT_SKIRT, ACCENT),
        (true, true) => (ACCENT_SKIRT, ACCENT_PRESSED),
        (false, false) => (SKIRT, FACE),
        (false, true) => (SKIRT, FACE_PRESSED),
    };
    let (bevel, sheen, name_fill) = if cap.key.accent {
        ("rgba(255,255,255,0.28)", "url(#sheen-accent)", "rgba(255,255,255,0.85)")
    } else {
        ("rgba(255,255,255,0.10)", "url(#sheen)", NAME)
    };
    let y = TRAY_TOP + PAD;
    let (fx, fy, fw) = (x + INSET, y + TOP + sink, w - 2. * INSET);
    let fr = RADIUS - 0.5 * INSET;

    let legends = match cap.key.name {
        Some(name) if !cap.key.legend.is_empty() => {
            let corner = 0.27 * KH;
            let small = 0.155 * KH;
            fframes::svgr!(
                <g>
                    <text x={fx + fw - LPAD} y={fy + 0.6 * LPAD + 0.86 * corner} font-family={ROUNDED} font-weight="500" font-size={corner} fill={LEGEND} text-anchor="end">{cap.key.legend}</text>
                    <text x={fx + LPAD} y={fy + FACE_H - 0.55 * LPAD - 0.2 * small} font-family={ROUNDED} font-weight="600" font-size={small} fill={name_fill}>{name}</text>
                </g>
            )
        }
        Some(name) => {
            let size = 0.2 * KH;
            fframes::svgr!(
                <text x={fx + fw / 2.} y={fy + FACE_H / 2. + 0.352 * size} font-family={ROUNDED} font-weight="600" font-size={size} fill={LEGEND} text-anchor="middle">{name}</text>
            )
        }
        None => {
            let size = 0.4 * KH;
            fframes::svgr!(
                <text x={fx + fw / 2.} y={fy + FACE_H / 2. + 0.352 * size} font-family={ROUNDED} font-weight="500" font-size={size} fill={LEGEND} text-anchor="middle">{cap.key.legend}</text>
            )
        }
    };

    fframes::svgr!(
        <g transform={transform} opacity={opacity}>
            <rect x={x} y={y} width={w} height={KH} rx={RADIUS} fill={skirt} filter="url(#cap-shadow)" />
            <rect x={fx} y={fy} width={fw} height={FACE_H} rx={fr} fill={face} />
            <rect x={fx} y={fy} width={fw} height={FACE_H} rx={fr} fill={sheen} />
            <rect x={fx + 0.5} y={fy + 0.5} width={fw - 1.} height={FACE_H - 1.} rx={fr - 0.5} fill="none" stroke={bevel} stroke-width="1" />
            {legends}
        </g>
    )
}

fn shot_svg<'a>(shot: &Shot, t: f32) -> Svgr<'a> {
    let first = shot.caps.iter().map(|c| c.appear).fold(f32::MAX, f32::min);
    if t < first || t > shot.leave + FADE_OUT {
        return Svgr::empty();
    }
    let opacity = ease_out(t - first, FADE_IN) * (1. - ease_in(t - shot.leave, FADE_OUT));
    let layouts = layouts(shot);
    let tray_left = slid(t, &layouts.iter().map(|(at, l)| (*at, Some(l.left))).collect::<Vec<_>>()).unwrap_or(0.);
    let tray_w = slid(t, &layouts.iter().map(|(at, l)| (*at, Some(l.width))).collect::<Vec<_>>()).unwrap_or(0.);

    let mut caps: Vec<Svgr> = Vec::new();
    for cap in shot.caps.iter().filter(|c| c.appear <= t) {
        let xs: Vec<(f32, Option<f32>)> = layouts
            .iter()
            .map(|(at, l)| (*at, l.caps.iter().find(|(s, _)| *s == cap.slot).map(|(_, x)| *x)))
            .collect();
        if let Some(x) = slid(t, &xs) {
            caps.push(cap_svg(cap, x, t));
        }
    }

    let badge = shot.badges.iter().rev().find(|(at, _)| *at <= t).map(|&(at, count)| {
        let xs: Vec<(f32, Option<f32>)> = layouts.iter().map(|(a, l)| (*a, l.badge)).collect();
        let x = slid(t, &xs).unwrap_or(0.);
        let bw = badge_width(count);
        let first = shot.badges[0].0;
        // Pops in from 0.4 the first time, bumps from 1.3 when the count goes up.
        let scale = if at == first { 0.4 + 0.6 * spring(t - at) } else { 1.3 - 0.3 * spring(t - at) };
        let cy = TRAY_TOP + PAD + TOP + FACE_H / 2.;
        let cx = x + bw / 2.;
        let size = 0.22 * KH;
        let transform = format!("translate({cx} {cy}) scale({scale}) translate({} {})", -cx, -cy);
        fframes::svgr!(
            <g transform={transform} opacity={ease_out(t - first, 0.1)}>
                <rect x={x} y={cy - BADGE_H / 2.} width={bw} height={BADGE_H} rx={BADGE_H / 2.} fill={ACCENT} filter="url(#cap-shadow)" />
                <text x={cx} y={cy + 0.352 * size} font-family={ROUNDED} font-weight="700" font-size={size} fill="#ffffff" text-anchor="middle">{format!("×{count}")}</text>
            </g>
        )
    });

    fframes::svgr!(
        <g opacity={opacity}>
            <rect x={tray_left} y={TRAY_TOP} width={tray_w} height={TRAY_H} rx={RADIUS + PAD} fill="rgba(15,15,18,0.74)" stroke="rgba(255,255,255,0.10)" stroke-width="1" filter="url(#tray-shadow)" />
            {caps}
            {badge.unwrap_or_else(Svgr::empty)}
        </g>
    )
}

// ---------------------------------------------------------------------------------------------
// The editor

const WIN_X: f32 = 190.;
const WIN_Y: f32 = 92.;
const WIN_W: f32 = 1420.;
const WIN_H: f32 = 690.;
const BAR_H: f32 = 56.;
const CODE_X: f32 = WIN_X + 112.;
const CODE_Y: f32 = WIN_Y + BAR_H + 34.;
const LINE_H: f32 = 38.;
const FONT: f32 = 23.;
const ADVANCE: f32 = FONT * 0.6182;

const CODE: [&str; 15] = [
    "fn shortcut(&mut self, ev: &KeyEvent) -> bool {",
    "    let mods = ev.modifiers;",
    "    if !mods.is_shortcut() && !ev.key.is_special() {",
    "        return false;",
    "    }",
    "    let mut keys = modifier_keys(mods);",
    "    keys.push(ev.key.clone());",
    "    match self.chunks.last_mut() {",
    "        Some(Chunk::Combo { keys: k, count, .. }) if *k == keys => {",
    "            *count += 1",
    "        }",
    "        _ => self.start(keys),",
    "    }",
    "    true",
    "}",
];
/// The line the shortcuts act on.
const ACTIVE: usize = 6;

const TEXT: &str = "#e4e4e8";
const KEYWORD: &str = "#ff8f6b";
const TYPE: &str = "#8fd0ff";
const FUNCTION: &str = "#ffd480";
const PUNCT: &str = "#9a9aa6";

const KEYWORDS: [&str; 11] = ["fn", "let", "mut", "if", "return", "match", "true", "false", "self", "Some", "bool"];

/// (column, text, colour) for each coloured run of a line.
fn highlight(line: &str) -> Vec<(usize, String, &'static str)> {
    let chars: Vec<char> = line.chars().collect();
    let mut out = Vec::new();
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        if c == ' ' {
            i += 1;
            continue;
        }
        let start = i;
        if c.is_alphanumeric() || c == '_' {
            while i < chars.len() && (chars[i].is_alphanumeric() || chars[i] == '_') {
                i += 1;
            }
            let word: String = chars[start..i].iter().collect();
            let color = if KEYWORDS.contains(&word.as_str()) {
                KEYWORD
            } else if word.chars().next().is_some_and(char::is_uppercase) {
                TYPE
            } else if chars.get(i) == Some(&'(') {
                FUNCTION
            } else if word.chars().all(|c| c.is_ascii_digit()) {
                KEYWORD
            } else {
                TEXT
            };
            out.push((start, word, color));
        } else {
            while i < chars.len() && !(chars[i].is_alphanumeric() || chars[i] == '_' || chars[i] == ' ') {
                i += 1;
            }
            out.push((start, chars[start..i].iter().collect(), PUNCT));
        }
    }
    out
}

// Edits, in the order they happen.
const DELETE_AT: f32 = 0.80;
const UNDO_AT: f32 = 2.56;
const MOVES: [(f32, i32); 4] = [(3.98, -1), (4.34, -1), (8.62, 1), (8.98, 1)];
const FIND_OPEN: f32 = 5.70;
const FIND_TYPED: [f32; 4] = [6.05, 6.15, 6.27, 6.38];
const FIND_CLOSE: f32 = 7.40;
const SAVE_AT: f32 = 10.30;
const EDITS: [f32; 10] = [DELETE_AT, UNDO_AT, 3.98, 4.34, FIND_OPEN, 6.38, FIND_CLOSE, 8.62, 8.98, SAVE_AT];
const QUERY: &str = "keys";

/// Vertical position of every line (in slots) at time `t`, as the active line moves.
fn slots(t: f32) -> [f32; 15] {
    let mut order: Vec<usize> = (0..15).collect();
    let mut out: [f32; 15] = std::array::from_fn(|i| i as f32);
    for &(at, dir) in &MOVES {
        if at > t {
            break;
        }
        let from = order.iter().position(|&l| l == ACTIVE).unwrap();
        let to = (from as i32 + dir) as usize;
        let other = order[to];
        order.swap(from, to);
        let p = ease_out(t - at, 0.16);
        out[ACTIVE] += dir as f32 * p;
        out[other] -= dir as f32 * p;
    }
    out
}

/// How much of the active line is there: 1, collapsing to 0 when deleted, back on undo.
fn presence(t: f32) -> f32 {
    if t < DELETE_AT {
        1.
    } else if t < UNDO_AT {
        1. - ease_out(t - DELETE_AT, 0.18)
    } else {
        ease_out(t - UNDO_AT, 0.18)
    }
}

fn editor<'a>(t: f32) -> Svgr<'a> {
    let slots = slots(t);
    let here = presence(t);
    let line_y = |line: usize| {
        let mut s = slots[line];
        if line != ACTIVE && slots[line] > slots[ACTIVE] {
            s -= 1. - here;
        }
        CODE_Y + s * LINE_H
    };

    let find = if t >= FIND_OPEN { ease_out(t - FIND_OPEN, 0.22) * (1. - ease_out(t - FIND_CLOSE, 0.15)) } else { 0. };
    let typed = FIND_TYPED.iter().filter(|&&at| at <= t).count();
    let found = if t >= FIND_TYPED[3] && t < FIND_CLOSE + 0.15 { ease_out(t - FIND_TYPED[3], 0.15) * (1. - ease_out(t - FIND_CLOSE, 0.15)) } else { 0. };

    // Current line band and caret follow the active line.
    let active_y = CODE_Y + slots[ACTIVE] * LINE_H;
    let last_edit = EDITS.iter().copied().filter(|&e| e <= t).fold(-10., f32::max);
    let idle = t - last_edit;
    let caret_on = idle < 0.6 || (idle * 1.0).fract() < 0.55;
    let caret_col = if here > 0.5 { CODE[ACTIVE].chars().count() } else { 4 };
    let caret = if caret_on && find < 0.5 {
        fframes::svgr!(<rect x={CODE_X + caret_col as f32 * ADVANCE + 1.} y={active_y - 26.} width="2.5" height="32" rx="1" fill="#ff8f6b" />)
    } else {
        Svgr::empty()
    };

    let mut lines: Vec<Svgr> = Vec::new();
    for (i, src) in CODE.iter().enumerate() {
        let y = line_y(i);
        let opacity = if i == ACTIVE { here.powi(3) } else { 1. };
        if opacity <= 0.01 {
            continue;
        }
        let runs: Vec<Svgr> = highlight(src)
            .into_iter()
            .map(|(col, text, color)| {
                fframes::svgr!(<text x={CODE_X + col as f32 * ADVANCE} y={y} font-family={MONO} font-weight="400" font-size={FONT} fill={color}>{text}</text>)
            })
            .collect();
        let matches: Vec<Svgr> = if found > 0. {
            src.match_indices(QUERY)
                .enumerate()
                .map(|(n, (col, _))| {
                    let current = i == ACTIVE && n == 0;
                    let fill = if current { "rgba(255,143,107,0.55)" } else { "rgba(255,212,128,0.22)" };
                    fframes::svgr!(<rect x={CODE_X + col as f32 * ADVANCE - 2.} y={y - 25.} width={QUERY.len() as f32 * ADVANCE + 4.} height="33" rx="5" fill={fill} opacity={found} />)
                })
                .collect()
        } else {
            Vec::new()
        };
        lines.push(fframes::svgr!(<g opacity={opacity}>{matches}{runs}</g>));
    }

    // Line numbers stay in place; the last one goes while a line is deleted.
    let numbers: Vec<Svgr> = (0..CODE.len())
        .map(|n| {
            let y = CODE_Y + n as f32 * LINE_H;
            let current = (slots[ACTIVE] - n as f32).abs() < 0.5;
            let opacity = if n == CODE.len() - 1 { here } else { 1. };
            let fill = if current { "#c9c9d1" } else { "#5d5d66" };
            fframes::svgr!(<text x={CODE_X - 36.} y={y} font-family={MONO} font-weight="400" font-size={FONT} fill={fill} text-anchor="end" opacity={opacity}>{(n + 1).to_string()}</text>)
        })
        .collect();

    let find_bar = if find > 0. {
        let (bw, bh) = (430., 52.);
        let bx = WIN_X + WIN_W - 28. - bw;
        let by = WIN_Y + BAR_H + 12. - (1. - find) * 70.;
        let query: String = QUERY.chars().take(typed).collect();
        let count = if typed == QUERY.len() { "1 of 6" } else { "" };
        fframes::svgr!(
            <g opacity={find}>
                <rect x={bx} y={by} width={bw} height={bh} rx="12" fill="#2a2a2f" stroke="rgba(255,255,255,0.12)" stroke-width="1" filter="url(#find-shadow)" />
                <circle cx={bx + 30.} cy={by + 24.} r="8.5" fill="none" stroke="#9a9aa6" stroke-width="2.5" />
                <line x1={bx + 36.5} y1={by + 30.5} x2={bx + 42.} y2={by + 36.} stroke="#9a9aa6" stroke-width="2.5" stroke-linecap="round" />
                <text x={bx + 58.} y={by + 34.} font-family={MONO} font-weight="400" font-size={FONT} fill={TEXT}>{query}</text>
                <rect x={bx + 58. + typed as f32 * ADVANCE + 1.} y={by + 13.} width="2.5" height="28" rx="1" fill="#ff8f6b" />
                <text x={bx + bw - 22.} y={by + 33.} font-family={ROUNDED} font-weight="500" font-size="19" fill="#8b8b96" text-anchor="end">{count}</text>
            </g>
        )
    } else {
        Svgr::empty()
    };

    // Unsaved dot, from the first edit until ⌘ S.
    let dirty = if (DELETE_AT..SAVE_AT).contains(&t) {
        fframes::svgr!(<circle cx={WIN_X + 244.} cy={WIN_Y + BAR_H / 2.} r="5" fill="#e4e4e8" />)
    } else {
        Svgr::empty()
    };

    fframes::svgr!(
        <g>
            <defs>
                <clipPath id="code-area">
                    <rect x={WIN_X} y={WIN_Y + BAR_H} width={WIN_W} height={WIN_H - BAR_H} />
                </clipPath>
            </defs>
            <g clip-path="url(#code-area)">
                <rect x={WIN_X} y={active_y - 28.} width={WIN_W} height={LINE_H} fill="rgba(255,255,255,0.045)" />
                {numbers}
                {lines}
                {caret}
                {find_bar}
            </g>
            {dirty}
        </g>
    )
}

// ---------------------------------------------------------------------------------------------

#[derive(Debug)]
pub struct KavePreview;

impl Video for KavePreview {
    const FPS: usize = 60;
    const WIDTH: usize = W;
    const HEIGHT: usize = H;
    const BACKGROUND_COLOR: Color = Color::BLACK;

    fn duration(&self) -> Duration<'_> {
        Duration::Seconds(LENGTH)
    }

    fn audio(&self) -> AudioMap<'_> {
        AudioMap::none()
    }

    fn render_frame<'a>(&'a self, frame: Frame, _ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        let t = frame.seconds();
        let editor = editor(t);
        let shots: Vec<Svgr> = SHOTS.iter().map(|s| shot_svg(s, t)).collect();
        fframes::svgr!(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1200" width="1800" height="1200">
                <defs>
                    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#f8e6bd" />
                        <stop offset="0.55" stop-color="#f2c690" />
                        <stop offset="1" stop-color="#e79a68" />
                    </linearGradient>
                    <radialGradient id="glow-a" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0" stop-color="#fff3d6" stop-opacity="0.85" />
                        <stop offset="1" stop-color="#fff3d6" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient id="glow-b" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0" stop-color="#e2804f" stop-opacity="0.55" />
                        <stop offset="1" stop-color="#e2804f" stop-opacity="0" />
                    </radialGradient>
                    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#ffffff" stop-opacity="0.08" />
                        <stop offset="0.6" stop-color="#ffffff" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="sheen-accent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#ffffff" stop-opacity="0.24" />
                        <stop offset="0.6" stop-color="#ffffff" stop-opacity="0" />
                    </linearGradient>
                    <filter id="cap-shadow" x="-20%" y="-20%" width="140%" height="150%">
                        <feDropShadow dx="0" dy="3.4" stdDeviation="2.6" flood-color="#000000" flood-opacity="0.4" />
                    </filter>
                    <filter id="tray-shadow" x="-30%" y="-60%" width="160%" height="240%">
                        <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#3a1a08" flood-opacity="0.35" />
                    </filter>
                    <filter id="window-shadow" x="-10%" y="-10%" width="120%" height="130%">
                        <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#3a1a08" flood-opacity="0.38" />
                    </filter>
                    <filter id="find-shadow" x="-10%" y="-30%" width="120%" height="180%">
                        <feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="#000000" flood-opacity="0.35" />
                    </filter>
                </defs>

                // Desktop
                <rect width="1800" height="1200" fill="url(#wall)" />
                <circle cx="1450" cy="180" r="720" fill="url(#glow-a)" />
                <circle cx="200" cy="1150" r="760" fill="url(#glow-b)" />

                // Menu bar, with kave's keyboard icon on the right
                <rect width="1800" height="40" fill="#ffffff" fill-opacity="0.38" />
                <text x="34" y="27" font-family={ROUNDED} font-weight="700" font-size="18" fill="#2b1d12">"Editor"</text>
                <text x="118" y="27" font-family={ROUNDED} font-weight="500" font-size="18" fill="#2b1d12">"File"</text>
                <text x="176" y="27" font-family={ROUNDED} font-weight="500" font-size="18" fill="#2b1d12">"Edit"</text>
                <text x="235" y="27" font-family={ROUNDED} font-weight="500" font-size="18" fill="#2b1d12">"Selection"</text>
                <text x="333" y="27" font-family={ROUNDED} font-weight="500" font-size="18" fill="#2b1d12">"View"</text>
                <rect x="1614" y="12" width="28" height="18" rx="4" fill="none" stroke="#2b1d12" stroke-width="2" />
                <rect x="1619" y="17" width="3" height="3" rx="1" fill="#2b1d12" />
                <rect x="1625" y="17" width="3" height="3" rx="1" fill="#2b1d12" />
                <rect x="1631" y="17" width="3" height="3" rx="1" fill="#2b1d12" />
                <rect x="1622" y="23" width="12" height="3" rx="1" fill="#2b1d12" />
                <text x="1766" y="27" font-family={ROUNDED} font-weight="500" font-size="18" fill="#2b1d12" text-anchor="end">"Thu 9:41"</text>

                // Editor window
                <rect x="190" y="92" width="1420" height="690" rx="20" fill="#1c1c20" filter="url(#window-shadow)" />
                <rect x="190.5" y="92.5" width="1419" height="689" rx="19.5" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1" />
                <line x1="190" y1="148" x2="1610" y2="148" stroke="rgba(255,255,255,0.07)" stroke-width="1" />
                <circle cx="222" cy="120" r="7.5" fill="#ff5f57" />
                <circle cx="247" cy="120" r="7.5" fill="#febc2e" />
                <circle cx="272" cy="120" r="7.5" fill="#28c840" />
                <text x="310" y="127" font-family={ROUNDED} font-weight="600" font-size="19" fill="#e4e4e8" text-anchor="start">"display.rs"</text>
                <text x="1580" y="127" font-family={ROUNDED} font-weight="500" font-size="17" fill="#6b6b76" text-anchor="end">"kave / src"</text>
                {editor}

                {shots}
            </svg>
        )
    }
}
