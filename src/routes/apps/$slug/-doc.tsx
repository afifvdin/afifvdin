import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { AppIcon } from "@/components/app-bits";
import type { App } from "@/data/apps";

export function AppDoc({
  app,
  title,
  children,
}: {
  app: App;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl px-4 pb-8">
      <Link
        to="/apps/$slug"
        params={{ slug: app.slug }}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 py-6 text-sm"
      >
        <ArrowLeftIcon className="size-3.5" /> {app.name}
      </Link>
      <header className="flex items-center gap-4">
        <AppIcon app={app} className="size-12 text-[3rem]" />
        <div>
          <p className="text-muted-foreground text-sm">{app.name}</p>
          <h1 className="font-serif text-4xl leading-none">{title}</h1>
        </div>
      </header>
      <div className="mt-10 space-y-4 text-pretty">{children}</div>
    </article>
  );
}
