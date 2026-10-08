import { createFileRoute, notFound } from "@tanstack/react-router";
import { SUPPORT_EMAIL } from "@/data/apps";
import { AppDoc } from "./-doc";
import { loadApp } from "./-load";

export const Route = createFileRoute("/apps/$slug/privacy")({
  loader: (ctx) => {
    const app = loadApp(ctx);
    if (!app.privacy) throw notFound();
    return app;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `Privacy Policy — ${loaderData.name}` }] : [],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const app = Route.useLoaderData();
  return (
    <AppDoc app={app} title="Privacy Policy">
      {app.privacy?.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <p>
        Questions? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </AppDoc>
  );
}
