import { LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Work({
  company,
  start,
  end = "Present",
  role,
  link = "#",
}: {
  company: string;
  start: string;
  end?: string;
  role: string;
  link?: string;
}) {
  return (
    <a className="group py-4" href={link}>
      <div className="flex items-center justify-between gap-4">
        <p
          className={cn(
            "flex items-center text-base",
            link !== "#" && "group-hover:underline",
          )}
        >
          {company} {link !== "#" && <LinkIcon className="ml-2 size-2.5" />}
        </p>
        <p className="text-muted-foreground">
          {start} - {end}
        </p>
      </div>
      <p
        className={cn(
          "text-muted-foreground",
          link !== "#" && "group-hover:underline",
        )}
      >
        {role}
      </p>
    </a>
  );
}
