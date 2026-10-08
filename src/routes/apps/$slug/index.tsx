import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { AppIcon, AppMedia, StatusPill } from "@/components/app-bits";
import { cn } from "@/lib/utils";
import { loadApp } from "./-load";

export const Route = createFileRoute("/apps/$slug/")({
  loader: loadApp,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Afifudin` },
          { name: "description", content: loaderData.tagline },
        ]
      : [],
  }),
  component: AppPage,
});

function AppPage() {
  const app = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
      <Link
        to="/"
        hash="apps"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 pb-6 text-sm"
      >
        <ArrowLeftIcon className="size-3.5" /> All apps
      </Link>

      <div
        style={{ backgroundColor: app.tint }}
        className="overflow-hidden rounded-[32px] p-6 text-neutral-800 sm:p-10"
      >
        <div
          className={cn(
            "grid gap-10",
            app.media?.phone && "sm:grid-cols-[1fr_auto]",
          )}
        >
          <header className="space-y-5">
            <AppIcon app={app} className="size-20 text-[5rem]" />
            <div className="space-y-2">
              <h1 className="font-serif text-5xl leading-none sm:text-6xl">
                {app.name}
              </h1>
              <p className="text-lg text-neutral-600">
                {app.tagline} · {app.platform}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={app.status} />
              {app.primary && (
                <PillLink href={app.primary.href} primary>
                  {app.primary.label}
                </PillLink>
              )}
              {app.links.map((link) => (
                <PillLink key={link.href} href={link.href}>
                  {link.label}
                </PillLink>
              ))}
            </div>
          </header>
          {app.media && (
            <AppMedia
              media={app.media}
              className={app.media.phone ? "sm:-mb-24" : undefined}
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-4 py-14 text-lg text-pretty">
        {app.description.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {app.features.length > 0 && (
          <ul className="space-y-2 pt-4">
            {app.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span
                  aria-hidden
                  style={{ backgroundColor: app.tint }}
                  className="mt-2 size-2.5 shrink-0 rounded-full ring-1 ring-black/10"
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {app.privacy && (
          <nav className="border-line text-muted-foreground mt-10 flex gap-6 border-t border-dashed pt-6 text-base">
            <Link
              to="/apps/$slug/privacy"
              params={{ slug: app.slug }}
              className="hover:text-foreground"
            >
              Privacy policy
            </Link>
            <Link
              to="/apps/$slug/support"
              params={{ slug: app.slug }}
              className="hover:text-foreground"
            >
              Support
            </Link>
          </nav>
        )}
      </div>
    </article>
  );
}

function PillLink({
  href,
  primary,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80",
        primary ? "bg-neutral-900 text-white" : "bg-white/70",
      )}
    >
      {children}
      <ArrowUpRightIcon className="size-3.5" />
    </a>
  );
}
