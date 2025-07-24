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
        <h3 className="group-hover:underline dark:font-medium">{title}</h3>
        <span className="text-muted-foreground text-xs">{year}</span>
      </div>
      <p className="text-muted-foreground group-hover:underline dark:font-medium">
        {description}
      </p>
    </a>
  );
}
