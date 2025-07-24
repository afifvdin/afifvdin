import { LinkIcon } from "lucide-react";

interface Props {
  url: string;
  imageUrl: string;
  title: string;
  year: string;
  description: string;
  stacks: string[];
}

export default function Project({
  url,
  imageUrl,
  title,
  year,
  description,
  stacks,
}: Props) {
  return (
    <a href={url} target="_blank" className="group">
      <div className="w-full gap-2 sm:flex">
        <div className="relative top-0 mb-2 aspect-[16/10] w-full overflow-hidden rounded-lg border transition-all group-hover:-top-1 group-hover:shadow-xl sm:max-w-36 dark:shadow-none">
          <img src={imageUrl} alt="afifvdin" className="z-10 object-cover" />
          <div className="absolute top-0 left-0 -z-10 aspect-[16/10] w-full animate-pulse bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="grow">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center group-hover:underline dark:font-medium">
              {title} <LinkIcon className="ml-2 size-2" />
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {year}
            </p>
          </div>
          <p className="mb-4 text-neutral-500 group-hover:underline dark:font-medium dark:text-neutral-400">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {stacks.map((stack, i) => {
              return (
                <p
                  key={title + i}
                  className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 font-medium dark:font-normal"
                >
                  {stack}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </a>
  );
}
