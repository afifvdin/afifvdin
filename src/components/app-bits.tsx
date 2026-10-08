import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { type App, type AppStatus, statusLabel } from "@/data/apps";
import { cn } from "@/lib/utils";

export function AppIcon({ app, className }: { app: App; className?: string }) {
  if (app.icon) {
    return (
      <img
        src={app.icon}
        alt=""
        className={cn(
          "aspect-square shrink-0 rounded-[22%] shadow-sm ring-1 ring-black/5",
          className,
        )}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        "grid aspect-square shrink-0 place-items-center rounded-[22%] bg-white font-serif text-neutral-800 shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      <span className="text-[0.45em]">{app.name.slice(0, 1)}</span>
    </div>
  );
}

const statusTone: Record<AppStatus, string> = {
  live: "bg-emerald-500",
  soon: "bg-amber-500",
  building: "bg-sky-500",
  "open-source": "bg-stone-400",
};

export function StatusPill({
  status,
  className,
}: {
  status: AppStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-xs text-neutral-700",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", statusTone[status])} />
      {statusLabel[status]}
    </span>
  );
}

// SSR'd <video autoPlay> doesn't always start after hydration, so kick it
export function AutoVideo(props: React.ComponentProps<"video">) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);
  return <video ref={ref} autoPlay loop muted playsInline {...props} />;
}

export function AppMedia({
  media,
  className,
}: {
  media: NonNullable<App["media"]>;
  className?: string;
}) {
  if (media.type === "video") {
    return (
      <AutoVideo
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        className={cn(
          "bg-black/10 shadow-[0_12px_30px_-12px_rgb(60_40_20/0.35)]",
          media.phone
            ? "mx-auto w-48 rounded-[1.75rem] border-[5px] border-neutral-900"
            : "w-full rounded-xl",
          className,
        )}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt={media.alt}
      className={cn(
        "shadow-[0_12px_30px_-12px_rgb(60_40_20/0.35)]",
        media.phone
          ? "mx-auto w-48 rounded-[1.75rem] border-[5px] border-neutral-900"
          : "w-full rounded-xl",
        className,
      )}
    />
  );
}

export function AppCard({ app, featured }: { app: App; featured?: boolean }) {
  return (
    <Link
      to="/apps/$slug"
      params={{ slug: app.slug }}
      style={{ backgroundColor: app.tint }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] p-5 text-neutral-800 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AppIcon app={app} className="size-11 text-[2.75rem]" />
          <div className="leading-tight">
            <p className="font-medium">{app.name}</p>
            <p className="text-sm text-neutral-600">{app.platform}</p>
          </div>
        </div>
        <span className="grid size-9 place-items-center rounded-full bg-white/80 transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRightIcon className="size-4" />
        </span>
      </div>

      <div
        className={cn(
          "flex flex-1 gap-6 pt-8",
          featured ? "flex-col sm:flex-row sm:items-end" : "flex-col",
        )}
      >
        <div className={cn("space-y-3", featured && "sm:max-w-xs sm:pb-2")}>
          <h3 className="font-serif text-3xl leading-none sm:text-4xl">
            {app.tagline}
          </h3>
          <StatusPill status={app.status} />
        </div>
        {app.media && (
          <div
            className={cn(
              "mt-auto transition-transform duration-500 group-hover:-rotate-1",
              featured && "sm:flex-1",
              app.media.phone && "-mb-16",
            )}
          >
            <AppMedia media={app.media} />
          </div>
        )}
      </div>
    </Link>
  );
}
