import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  return (
    <nav className="z-50 sticky top-0 py-4 bg-background/50 backdrop-blur-xl flex items-center justify-between">
      <ul className="flex items-center gap-4 sm:gap-8">
        <li className="cursor-pointer">
          <a href="#works" className="underline">
            #works
          </a>
        </li>
        <li className="cursor-pointer">
          <a href="#projects" className="underline">
            #projects
          </a>
        </li>
        <li className="cursor-pointer">
          <a href="#opensource" className="underline">
            #open source
          </a>
        </li>
      </ul>
      <ModeToggle />
    </nav>
  )
}
