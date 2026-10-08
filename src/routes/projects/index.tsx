import { createFileRoute, redirect } from "@tanstack/react-router";

// Old URL from the previous site; everything lives on the home page now
export const Route = createFileRoute("/projects/")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "apps" });
  },
});
