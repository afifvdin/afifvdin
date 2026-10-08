import { notFound, redirect } from "@tanstack/react-router";
import { getApp } from "@/data/apps";

// Old slugs of renamed apps, so links already shared keep working.
const renamed: Record<string, string> = { "db-studio": "qprofiler" };

export function loadApp({ params }: { params: { slug: string } }) {
  const target = renamed[params.slug];
  if (target) throw redirect({ to: "/apps/$slug", params: { slug: target } });
  const app = getApp(params.slug);
  if (!app) throw notFound();
  return app;
}
