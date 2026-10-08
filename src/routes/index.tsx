import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { AppCard } from "@/components/app-bits";
import { apps, archive } from "@/data/apps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="py-16 sm:py-24">
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] text-balance sm:text-7xl">
          Small apps, <em className="text-brand">made with care.</em>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg text-pretty">
          I build quiet, focused apps for iPhone and the web. Each one does a
          single thing well, with no ads and no tracking.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <a
            href="#apps"
            className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85"
          >
            See the apps
          </a>
          <a
            href="mailto:hi@afifvdin.com"
            className="bg-surface border-line rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white"
          >
            Say hi
          </a>
        </div>
      </section>

      <section id="apps" className="scroll-mt-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {apps.map((app, i) => (
            <li key={app.slug} className={cn(i === 0 && "sm:col-span-2")}>
              <AppCard app={app} featured={i === 0} />
            </li>
          ))}
        </ul>
      </section>

      <section className="py-20">
        <h2 className="font-serif text-3xl">Earlier work</h2>
        <ul className="mt-4">
          {archive.map((item) => {
            const body = (
              <>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-medium">
                    {item.name}
                    {item.url && (
                      <ArrowUpRightIcon className="text-muted-foreground size-3.5" />
                    )}
                  </span>
                  <span className="text-muted-foreground block text-sm">
                    {item.description}
                  </span>
                </span>
                <span className="text-muted-foreground font-serif text-lg">
                  {item.year}
                </span>
              </>
            );
            const row =
              "border-line flex items-start justify-between gap-4 border-b border-dashed py-4";
            return (
              <li key={item.name}>
                {item.url ? (
                  <a
                    href={item.url}
                    target={item.url.startsWith("/") ? undefined : "_blank"}
                    rel="noreferrer"
                    className={cn(row, "hover:text-brand transition-colors")}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={row}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
