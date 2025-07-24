import { LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Work({
  company,
  start,
  end = "Present",
  role,
  url = "#",
}: {
  company: string;
  start: string;
  end?: string;
  role: string;
  url?: string;
}) {
  return (
    <a className="group py-4" href={url}>
      <div className="flex items-center justify-between gap-4">
        <p
          className={cn(
            "flex items-center text-base",
            url !== "#" && "group-hover:underline",
          )}
        >
          {company}{" "}
          {url !== "#" && <LinkIcon className="ml-1 size-2.5 sm:ml-2" />}
        </p>
        <p className="text-muted-foreground">
          {start} - {end}
        </p>
      </div>
      <p
        className={cn(
          "text-muted-foreground",
          url !== "#" && "group-hover:underline",
        )}
      >
        {role}
      </p>
    </a>
  );
}
