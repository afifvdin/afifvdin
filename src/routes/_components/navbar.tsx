import { Link } from "@tanstack/react-router";
import { AlphaMark } from "@/components/logo";

export function Navbar() {
  return (
    <header>
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-serif text-2xl leading-none"
        >
          <AlphaMark className="text-brand h-5 w-auto" />
          Afifudin
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground max-sm:hidden">
            Elsewhere —
          </span>
          <a
            href="https://github.com/afifvdin"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/afifvdin"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand transition-colors"
          >
            X
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-10 text-sm sm:px-6">
      <p>© {new Date().getFullYear()} Muhammad Afifudin Abdullah</p>
      <a href="mailto:hi@afifvdin.com" className="hover:text-foreground">
        hi@afifvdin.com
      </a>
    </footer>
  );
}
