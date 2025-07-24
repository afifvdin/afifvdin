import { LinkIcon } from "lucide-react";

export function OpenSource({
  url,
  title,
  year,
  description,
}: {
  url: string;
  title: string;
  year: string;
  description: string;
}) {
  return (
    <a href={url} target="_blank" className="group">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center group-hover:underline dark:font-medium">
          {title} <LinkIcon className="ml-1 size-2.5 sm:ml-2" />
        </h3>
        <span className="text-muted-foreground text-xs">{year}</span>
      </div>
      <p className="text-muted-foreground group-hover:underline dark:font-medium">
        {description}
      </p>
    </a>
  );
}
