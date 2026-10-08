import { createFileRoute, notFound } from "@tanstack/react-router";
import { SUPPORT_EMAIL } from "@/data/apps";
import { AppDoc } from "./-doc";
import { loadApp } from "./-load";

export const Route = createFileRoute("/apps/$slug/support")({
  loader: (ctx) => {
    const app = loadApp(ctx);
    // Support pages exist for store apps, which are the ones with a policy
    if (!app.privacy) throw notFound();
    return app;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `Support — ${loaderData.name}` }] : [],
  }),
  component: SupportPage,
});

function SupportPage() {
  const app = Route.useLoaderData();
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${app.name} support`)}`;
  return (
    <AppDoc app={app} title="Support">
      <p>
        Found a bug, have a question, or want to suggest something? Send an
        email and I'll get back to you.
      </p>
      <a
        href={mailto}
        className="bg-foreground text-background inline-flex rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
      >
        Email {SUPPORT_EMAIL}
      </a>
    </AppDoc>
  );
}
