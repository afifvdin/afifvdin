import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import "@fontsource/inter";
import "@fontsource/spectral";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { Navbar } from "./_components/navbar";

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
        title: "Afifudin - Software Engineer",
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
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-neutral-100 font-serif text-sm tracking-tight antialiased">
        <Navbar />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
