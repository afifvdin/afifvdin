export function Navbar() {
  return (
    <div className="from-accent via-accent top-0 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b to-transparent p-4 sm:sticky sm:gap-4">
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="font-departure text-blue-500 uppercase hover:underline"
        >
          Afifudin
        </a>
        <a href="/crafts" className="hover:underline">
          Craft
        </a>
        <a href="/projects" className="hover:underline">
          Projects
        </a>
      </div>
      <div className="flex items-center justify-end gap-4">
        <p className="text-muted-foreground pr-2">Elsewhere</p>
        <a
          className="hover:underline"
          href="https://x.com/afifvdin"
          target="_blank"
        >
          X
        </a>
        <a
          className="hover:underline"
          href="https://github.com/afifvdin"
          target="_blank"
        >
          Github
        </a>
      </div>
    </div>
  );
}
