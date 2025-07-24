import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4">
      <ul className="flex items-center gap-4 tracking-tight sm:gap-8">
        <li className="hidden sm:block">
          <img
            src="https://avatars.githubusercontent.com/u/94339143?v=4"
            className="size-7 rounded-full"
            alt="afifvdin"
          />
        </li>
        <li className="cursor-pointer underline">
          <a href="#work-experiences">work experiences</a>
        </li>
        <li className="cursor-pointer underline">
          <a href="#projects">projects</a>
        </li>
        <li className="cursor-pointer underline">
          <a href="#open-source">open source</a>
        </li>
      </ul>
      <ModeToggle />
    </nav>
  );
}
