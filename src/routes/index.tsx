import { createFileRoute } from "@tanstack/react-router";
import { OpenSource } from "./_components/open-source";
import { WorkExperience } from "./_components/work-experience";
import { Project } from "./_components/project";
import { FeaturedCraft } from "./_components/featured-craft";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 pb-8">
      <div className="space-y-2">
        <h1 className="font-departure text-xl uppercase">Afifudin</h1>
        <p className="text-muted-foreground text-base">
          Love building things.
          <br />I use arch hyprland and nvim btw.
        </p>
      </div>
      <FeaturedCraft />
      <WorkExperience />
      <Project />
      <OpenSource />
    </div>
  );
}
