export type AppStatus =
  | "live"
  | "soon"
  | "building"
  | "open-source"
  | "personal";

export type AppLink = { label: string; href: string };

export type App = {
  slug: string;
  name: string;
  tagline: string;
  platform: string;
  status: AppStatus;
  year: number;
  // Falls back to a monogram tile when missing
  icon?: string;
  description: string[];
  features: string[];
  primary?: AppLink;
  links: AppLink[];
  // Pastel paper color for the app's card
  tint: string;
  media?: {
    type: "image" | "video";
    src: string;
    alt: string;
    poster?: string;
    phone?: boolean;
  };
  // Present only for apps that ship to a store and need a public policy URL
  privacy?: string[];
};

export const SUPPORT_EMAIL = "hi@afifvdin.com";

export const statusLabel: Record<AppStatus, string> = {
  live: "Live",
  soon: "Coming soon",
  building: "Building",
  "open-source": "Open source",
  personal: "Personal tool",
};

export const apps: App[] = [
  {
    slug: "teachable-machine",
    name: "Teachable Machine",
    tagline: "Train an image classifier in your browser",
    platform: "Web",
    status: "live",
    year: 2026,
    icon: "/apps/teachable-machine/icon.svg",
    tint: "#e7def6",
    description: [
      "An open-source take on Google's Teachable Machine. Record samples with your webcam or drop in images, train in seconds, and export a TensorFlow.js model.",
      "Everything runs on-device. Your images never leave the browser.",
    ],
    features: [
      "Webcam capture or image upload per class",
      "MobileNetV2 embeddings + a small dense head, so training takes seconds",
      "Live preview from webcam or file",
      "Export a standalone TensorFlow.js model",
      "Save and open projects as .zip",
    ],
    primary: {
      label: "Open app",
      href: "https://teachablemachine.afifvdin.com",
    },
    links: [
      {
        label: "Source",
        href: "https://github.com/afifvdin/teachable-machine",
      },
    ],
    media: {
      type: "image",
      src: "/apps/teachable-machine/screenshot.jpg",
      alt: "Teachable Machine landing page: Teach a machine to see your world",
    },
  },
  {
    slug: "discreet-tasbeeh",
    name: "Discreet Tasbeeh",
    tagline: "A quiet, private dhikr counter",
    platform: "iPhone",
    status: "soon",
    year: 2026,
    icon: "/apps/discreet-tasbeeh/icon.png",
    tint: "#dcebdc",
    description: [
      "A quiet tasbeeh counter that stays out of the way.",
      "Tap anywhere to count and feel a gentle vibration with every tap, so you can keep count without looking. The screen stays pitch black with the number barely visible, so the people around you won't notice.",
    ],
    features: [
      "Tap anywhere to count",
      "Haptic feedback on every tap",
      "Dark, discreet design",
      "Your count is saved automatically",
      "No ads, no accounts, no tracking",
    ],
    links: [],
    media: {
      type: "video",
      src: "/apps/discreet-tasbeeh/preview.mp4",
      poster: "/apps/discreet-tasbeeh/poster.jpg",
      alt: "Discreet Tasbeeh counting up from 0 to 12 on a pitch black screen with the number barely visible, then resetting to 0",
      phone: true,
    },
    privacy: [
      "Discreet Tasbeeh does not collect, store, or share any personal data.",
      "The tap count is stored only on your device and is never sent anywhere.",
      "The app has no analytics, no ads, and no network access.",
    ],
  },
  {
    slug: "kibla",
    name: "Kibla",
    tagline: "A simple Qibla compass",
    platform: "iPhone",
    status: "soon",
    year: 2026,
    icon: "/apps/kibla/icon.png",
    tint: "#f8e1cf",
    description: [
      "A Qibla compass with nothing else on the screen.",
      "An arrow points to the Qibla and the number below shows how far you are from facing it, with north, east, south and west turning around it. Turn until the arrow points straight up and you'll feel a gentle tap.",
    ],
    features: [
      "One arrow, pointing to the Qibla",
      "Compass ring that turns with you",
      "Haptic tap when you're facing it",
      "Soft pastel design",
      "Works anywhere, your location stays on your device",
      "No ads, no accounts, no tracking",
    ],
    links: [],
    media: {
      type: "video",
      src: "/apps/kibla/preview.mp4",
      poster: "/apps/kibla/poster.jpg",
      alt: "Kibla's arrow and compass ring turning until the arrow points straight up at 0 degrees",
      phone: true,
    },
    privacy: [
      "Kibla uses your location only to work out the direction of the Qibla. This happens on your device, and your location is never stored or sent anywhere.",
      "If you send feedback from the app, your message, the email address you choose to add, and basic app and device details (app version, iOS version, device model, language, and the country the request comes from) are sent to us so we can read and reply to it. Nothing else is collected.",
      "The app has no analytics, no ads, and no tracking.",
    ],
  },
  {
    slug: "kave",
    name: "Kave",
    tagline: "Your keystrokes, as little keycaps",
    platform: "macOS",
    status: "open-source",
    year: 2026,
    icon: "/apps/kave/icon.png",
    tint: "#f5e6bf",
    description: [
      "A keystroke visualizer for macOS. Shows the keys you press on screen, for screencasts, live coding and presentations.",
      "Every key is drawn as a small 3D keycap, labelled like an Apple keyboard. Caps sink while you hold a key and spring back when you let go, Esc and Return get a coral accent cap, and a shortcut pressed again and again shows once with a count. Written in Rust, with Windows and Linux next.",
    ],
    features: [
      "Keycaps that sink while you hold a key",
      "Shortcuts mode, or typing mode for everything you type",
      "Follows your keyboard layout",
      "Light and dark, following the system",
      "Repeated shortcuts counted, not stacked",
      "Size, accent color and labels are configurable",
      "Lives in the menu bar, never steals a click",
    ],
    primary: {
      label: "View on GitHub",
      href: "https://github.com/afifvdin/kave",
    },
    links: [],
    media: {
      type: "video",
      src: "/apps/kave/preview.mp4",
      poster: "/apps/kave/poster.jpg",
      alt: "Kave's keycaps showing shortcuts like command shift K and option up times two while they edit code in an editor",
    },
  },
  {
    slug: "qprofiler",
    name: "QProfiler",
    tagline: "How heavy is that query?",
    platform: "macOS",
    status: "personal",
    year: 2026,
    icon: "/apps/qprofiler/icon.png",
    tint: "#dfe8f1",
    description: [
      "A Mac app for seeing how heavy a query is, on Postgres and TigerGraph.",
      "For Postgres it runs EXPLAIN ANALYZE and lays the plan out as a tree, with the slowest nodes at the top and a badge wherever the planner's row estimate was far off. For TigerGraph it profiles each statement and samples the server's memory while the query runs, so you see the real peak next to the smaller number the profiler reports.",
    ],
    features: [
      "Postgres plan tree with the hottest nodes first",
      "Misestimate badges, buffers and sorts that spill to disk",
      "Workload view from pg_stat_statements",
      "TigerGraph profiler with a per-statement breakdown",
      "True memory peak and memory over time, not just what the profiler reports",
      "Profiles queries that aren't installed by installing a temporary copy",
      "History of every run, and side-by-side compare",
    ],
    links: [],
    media: {
      type: "video",
      src: "/apps/qprofiler/preview.mp4",
      poster: "/apps/qprofiler/poster.jpg",
      alt: "QProfiler showing a Postgres query plan with misestimate badges, a sort spilling to disk, two runs compared, the workload view, and a TigerGraph profile where the profiler reports 1 MB but the process grew 34 MB",
    },
  },
];

export function getApp(slug: string) {
  return apps.find((app) => app.slug === slug);
}

export const archive: {
  name: string;
  description: string;
  year: number;
  url?: string;
}[] = [
  {
    name: "Minigrep",
    description: "A tiny grep in Rust",
    year: 2025,
    url: "https://github.com/afifvdin/minigrep-rs",
  },
  {
    name: "POS Tagger",
    description: "Indonesian part-of-speech tagging, Word2Vec + BiLSTM (IEEE)",
    year: 2024,
    url: "/demo/tagger",
  },
  {
    name: "Indonesian cspell dictionary",
    description: "Spell checking for Bahasa Indonesia, shipped to VS Code",
    year: 2024,
    url: "https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-indonesian",
  },
  {
    name: "Luct",
    description: "Lung area segmentation with AI",
    year: 2024,
  },
  {
    name: "Unvolds",
    description: "COVID-19 detection with AI",
    year: 2023,
  },
];
