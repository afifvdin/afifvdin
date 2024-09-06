import ProjectCard from "@/components/custom-ui/project-card"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import Navbar from "./_components/navbar"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 pb-48">
      <Navbar />
      <h1 className="mt-8 text-lg font-medium">Muhammad Afifudin Abdullah</h1>
      <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium">
        Software Engineer
      </p>
      <br />
      <p className="text-neutral-500 dark:text-neutral-400">
        Recently graduated with degree in computer science. I love building
        things and solving problems. I enjoy web development and app
        development. I also love to combine my app with AI and deep learning
      </p>
      <div className="mt-8 flex items-center justify-between py-2">
        <ul className="flex items-center gap-8">
          <li className="cursor-pointer">
            <Link href="mailto:afifudin.fdn@gmail.com">
              <Mail className="size-5" />
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link href="https://linkedin.com/in/afifudin" target="_blank">
              <Linkedin className="size-5" />
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link href="https://github.com/afifvdin" target="_blank">
              <Github className="size-5" />
            </Link>
          </li>
        </ul>
      </div>
      <span id="building" />
      <h2 className="mt-20 text-lg font-medium">Building</h2>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 sm:gap-y-4 gap-x-4 sm:gap-8">
        <ProjectCard
          url="https://catsplash.afifvdin.dev"
          imageUrl="/catsplash.png"
          title="Catsplash"
          year=""
          description="Search for cats or make a meme"
          stacks={[
            "Next.js",
            "Tailwind CSS",
            "Neon Postgres",
            "Drizzle",
            "Lucia",
          ]}
        />
        <ProjectCard
          url="https://yer.afifvdin.dev"
          imageUrl="/yer.png"
          title="Yer"
          year=""
          description="
Part-of-Speech Tagger for your dataset."
          stacks={["Next.js", "Tailwind CSS"]}
        />
        <ProjectCard
          url="https://tagger.afifvdin.dev"
          imageUrl="/tagger.png"
          title="Tagger"
          year=""
          description="AI Part-of-Speech Tagger for your tweets."
          stacks={["Next.js", "Tailwind CSS", "Python (GCP)"]}
        />
      </div>
      <span id="works" />
      <h2 className="mt-20 text-lg font-medium">Works</h2>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 sm:gap-y-4 gap-x-4 sm:gap-8">
        <ProjectCard
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
        <ProjectCard
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
        <ProjectCard
          url="https://github.com/afifvdin/dovtron"
          imageUrl="/dovtron.png"
          title="Dovtron"
          year="2023"
          description="Detect corn leaves disease with AI."
          stacks={["Flutter", "Python (GCP)"]}
        />
        <ProjectCard
          url="https://labti.afifvdin.dev"
          imageUrl="/labti.png"
          title="LabTI"
          year="2022"
          description="Automate Lab Management."
          stacks={["Next.js", "Tailwind CSS", "Node.js", "MongoDB"]}
        />
      </div>
      <span id="opensource" />
      <h2 className="mt-20 text-lg font-medium">Open Source</h2>
      <br />
      <Link
        href="https://www.npmjs.com/package/@cspell/dict-id-id"
        target="_blank"
        className="group"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="group-hover:underline dark:font-medium">Code Spell</h3>
          <span className="text-xs text-neutral-400">2024</span>
        </div>
        <p className="group-hover:underline text-neutral-500 dark:text-neutral-400 dark:font-medium">
          Creating Indonesian dictionary for Spell Checker.
        </p>
      </Link>
      <br />
      <Link
        href="https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-indonesian"
        target="_blank"
        className="group"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="group-hover:underline dark:font-medium">
            VS Code Code Spell Dictionary Extension
          </h3>
          <span className="text-xs text-neutral-400">2024</span>
        </div>
        <p className="group-hover:underline text-neutral-500 dark:text-neutral-400 dark:font-medium">
          Bringing the Indonesian Spell Checker into Visual Studio Code
          Extension.
        </p>
      </Link>
    </div>
  )
}
