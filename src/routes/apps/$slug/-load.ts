import { notFound } from "@tanstack/react-router";
import { getApp } from "@/data/apps";

export function loadApp({ params }: { params: { slug: string } }) {
  const app = getApp(params.slug);
  if (!app) throw notFound();
  return app;
}
