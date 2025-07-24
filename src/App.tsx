import { Github, Linkedin, Mail } from "lucide-react";

import Navbar from "./_components/navbar";
import { OpenSource } from "./components/custom-ui/open-source";
import Project from "./components/custom-ui/project";
import { ThemeProvider } from "./components/theme-provider";
import { Work } from "./components/custom-ui/work";

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="mx-auto max-w-3xl px-4 pb-48 text-sm tracking-tight sm:px-16">
        <Navbar />
        <h1 className="mt-8 font-medium">Muhammad Afifudin Abdullah</h1>
        <p className="text-muted-foreground font-medium">Software Engineer</p>
        <br />
        <p className="text-muted-foreground">
          I'm software engineer who love building things and solving problems.
          Currently at{" "}
          <a
            className="hover:text-foreground transition-all"
            href="https://feedloop.ai"
            target="_blank"
          >
            Feedloop.ai
          </a>{" "}
          building AI-based lending system and towing app. I also love ricing my
          linux the way i love to use.
        </p>
        <div className="mt-8 flex items-center justify-between py-2">
          <ul className="flex items-center gap-8">
            <li className="cursor-pointer">
              <a href="mailto:afifudin.fdn@gmail.com">
                <Mail className="size-5" />
              </a>
            </li>
            <li className="cursor-pointer">
              <a href="https://linkedin.com/in/afifudin" target="_blank">
                <Linkedin className="size-5" />
              </a>
            </li>
            <li className="cursor-pointer">
              <a href="https://github.com/afifvdin" target="_blank">
                <Github className="size-5" />
              </a>
            </li>
          </ul>
        </div>
        <span id="work-experience" />
        <h2 className="mt-20 text-lg font-medium">Work Experience</h2>
        <Work
          company="Feedloop.ai"
          start="Sep 2024"
          role="Fullstack Engineer"
        />
        <span id="projects" />
        <h2 className="mt-20 text-lg font-medium">Projects</h2>
        <br />
        <div className="flex flex-col gap-6">
          <Project
            url="https://yer.afifvdin.dev"
            imageUrl="/yer.png"
            title="Yer"
            year="2024"
            description="
Part-of-Speech Tagger for your dataset."
            stacks={["Next.js", "Tailwind CSS"]}
          />
          <Project
            url="https://tagger.afifvdin.dev"
            imageUrl="/tagger.png"
            title="Tagger"
            year="2024"
            description="AI Part-of-Speech Tagger for your tweets."
            stacks={["Next.js", "Tailwind CSS", "Python (GCP)"]}
          />
          <Project
            url="https://luct.afifvdin.dev"
            imageUrl="/luct.png"
            title="Luct"
            year="2024"
            description="Segment lung area with AI."
            stacks={[
              "Next.js",
              "Tailwind CSS",
              "Flutter",
              "Hive",
              "Python (GCP)",
            ]}
          />
          <Project
            url="https://unvolds.afifvdin.dev"
            imageUrl="/unvolds.png"
            title="Unvolds"
            year="2023"
            description="Detect COVID-19 with AI."
            stacks={[
              "Next.js",
              "Tailwind CSS",
              "Flutter",
              "Hive",
              "Python (GCP)",
            ]}
          />
          <Project
            url="https://github.com/afifvdin/dovtron"
            imageUrl="/dovtron.png"
            title="Dovtron"
            year="2023"
            description="Detect corn leaves disease with AI."
            stacks={["Flutter", "Python (GCP)"]}
          />
        </div>
        <span id="open-source" />
        <h2 className="mt-20 text-lg font-medium">Open Source</h2>
        <br />
        <OpenSource
          url="https://www.npmjs.com/package/@cspell/dict-id-id"
          title="Code Spell"
          year="2024"
          description="Building one for Bahasa Indonesia"
        />
        <br />
        <OpenSource
          url="https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-indonesian"
          title="VS Code Code Spell Dictionary Extension
          "
          year="2024"
          description="Distributes Indonesian Spell Checker to Visual Studio Code Extension."
        />
      </div>
    </ThemeProvider>
  );
}
