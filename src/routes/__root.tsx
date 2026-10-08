import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { Footer, Navbar } from "./_components/navbar";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Afifudin — Apps",
      },
      {
        name: "description",
        content: "Small, focused apps for iPhone and the web by Afifudin.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="font-serif text-5xl">Page not found</h1>
      <Link to="/" className="text-brand mt-4 inline-block underline">
        Back to all apps
      </Link>
    </div>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-[calc(100dvh-8rem)]">{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
