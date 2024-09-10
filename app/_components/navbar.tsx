import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="z-50 sticky top-0 py-4 bg-background/50 backdrop-blur-xl flex items-center justify-between">
      <ul className="flex items-center gap-4 sm:gap-8">
        <li className="cursor-pointer">
          <Link href="#works" className="underline">
            #works
          </Link>
        </li>
        <li className="cursor-pointer">
          <Link href="#projects" className="underline">
            #projects
          </Link>
        </li>
        <li className="cursor-pointer">
          <Link href="#opensource" className="underline">
            #open source
          </Link>
        </li>
      </ul>
      <ThemeToggle />
    </nav>
  )
}
