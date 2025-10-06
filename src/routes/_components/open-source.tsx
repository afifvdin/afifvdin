import { LinkIcon } from "lucide-react";

const data = [
  {
    name: "Code Spell",
    description: "Building one for Bahasa Indonesia",
    year: 2024,
    url: "https://www.npmjs.com/package/@cspell/dict-id-id",
  },
  {
    name: "VS Code Code Spell Disctionary Extension",
    description:
      "Distributes Indonesian Spell Checker to Visual Studio Code Extension.",
    year: 2024,
    url: "https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-indonesian",
  },
];

export function OpenSource() {
  return (
    <div className="py-8">
      <h2
        id="open-source"
        className="font-departure text-muted-foreground uppercase"
      >
        Open source
      </h2>
      <div className="space-y-4 py-4">
        {data.map((exp, i) => {
          return (
            <a
              key={i}
              href={exp.url}
              target="_blank"
              className="flex items-start justify-between gap-2 hover:underline"
            >
              <div>
                <p className="flex items-center gap-1">
                  <span>{exp.name}</span>
                  <LinkIcon className="size-2 h-lh" />
                </p>
                <p className="text-muted-foreground">{exp.description}</p>
              </div>
              <p>{exp.year}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
