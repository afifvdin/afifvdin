import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="h-full font-normal flex flex-col items-center justify-center">
      <div className="w-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl tracking-tight">Afifudin Abdullah</h1>
            <ThemeToggle />
          </div>
          <br />
          <p className="text-foreground/75">
            <span>Recently graduated with degree in computer science. </span>
            <span>I love building things and solving problems. </span>
            <span>I enjoy web development and app development. </span>
          </p>
          <br />
          <p className="text-foreground/75">
            Sometimes, when it&apos;s not about an app, it&apos;s about AI or
            deep learning.
          </p>
          <br />
          <br />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <h2 className="text-sm text-foreground/50 mb-4">Building</h2>
              <h3 className="underline mb-2">
                <Link href="https://yer.afifvdin.dev" target="_blank">
                  Yer
                </Link>
              </h3>
              <p className="text-foreground/75">
                <span>
                  An app that helps developers to make Part-of-Speech Tagging
                  label for deep learning dataset purpose.
                </span>
                <br />
                <span className="text-xs text-foreground/50">
                  Next.js with TailwindCSS.
                </span>
              </p>
              <br />
              <h3 className="underline mb-2">
                <Link href="https://tagger.afifvdin.dev" target="_blank">
                  Tagger
                </Link>
              </h3>
              <p className="text-foreground/75">
                <span>
                  My skripsi app for Part-of-Speech Tagging on X (Twitter).
                </span>
                <br />
                <span className="text-xs text-foreground/50">
                  Next.js, TailwindCSS and Python (GCP).
                </span>
              </p>
            </div>
            <div>
              <h2 className="text-sm text-foreground/50 mb-4">Projects</h2>
              <h3 className="underline mb-2">
                <Link href="https://luct.afifvdin.dev" target="_blank">
                  Luct
                </Link>
              </h3>
              <p className="text-foreground/75">
                <span>
                  An app to segment lung area using digital CT-scan images.
                </span>
                <br />
                <span className="text-xs text-foreground/50">
                  Next.js, TailwindCSS, Flutter, and Python (GCP).
                </span>
              </p>
              <br />
              <h3 className="underline mb-2">
                <Link href="https://unvolds.afifvdin.dev" target="_blank">
                  Unvolds
                </Link>
              </h3>
              <p className="text-foreground/75">
                <span>
                  An app to detect COVID-19 using digital X-ray images.
                </span>
                <br />
                <span className="text-xs text-foreground/50">
                  Next.js, TailwindCSS, Flutter, and Python (GCP).
                </span>
              </p>
              <br />
              <h3 className="underline mb-2 text-foreground/70">
                <Link
                  href="https://github.com/afifvdin/dovtron"
                  target="_blank"
                >
                  Dovtron (removed by Google Play)
                </Link>
              </h3>
              <p className="text-foreground/75">
                <span>An app to detect corn leaves disease.</span>
                <br />
                <span className="text-xs text-foreground/50">
                  Flutter and Python (GCP).
                </span>
              </p>
            </div>
            <div>
              <h2 className="text-sm text-foreground/50 mb-4">Open Source</h2>
              <h3 className="underline mb-2">
                <Link
                  href="https://www.npmjs.com/package/@cspell/dict-id-id"
                  target="_blank"
                >
                  Code Spell
                </Link>
              </h3>
              <p className="text-foreground/75">
                Creating Indonesian dictionary for Spell Checker.
              </p>
              <br />
              <h3 className="underline mb-2">
                <Link
                  href="https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-indonesian"
                  target="_blank"
                >
                  VS Code Code Spell Dictionary Extension
                </Link>
              </h3>
              <p className="text-foreground/75">
                Bringing the Indonesian Spell Checker into Visual Studio Code
                Extension.
              </p>
            </div>
          </div>
          <br />
          <br />
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="mailto:afifudin.fdn@gmail.com"
              className="flex items-center gap-1 justify-center text-foreground/50 hover:text-foreground transition-all"
            >
              <span>Google Mail</span>
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="https://linkedin.com/in/afifudin"
              target="_blank"
              className="flex items-center gap-1 justify-center text-foreground/50 hover:text-foreground transition-all"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="https://github.com/afifvdin"
              target="_blank"
              className="flex items-center gap-1 justify-center text-foreground/50 hover:text-foreground transition-all"
            >
              <span>Github</span>
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="https://x.com/afifvdin"
              target="_blank"
              className="flex items-center gap-1 justify-center text-foreground/50 hover:text-foreground transition-all"
            >
              <span>X (Twitter)</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
