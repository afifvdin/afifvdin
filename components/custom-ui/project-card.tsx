import Image from "next/image"
import Link from "next/link"

interface Props {
  url: string
  imageUrl: string
  title: string
  year: string
  description: string
  stacks: string[]
}

export default function ProjectCard({
  url,
  imageUrl,
  title,
  year,
  description,
  stacks,
}: Props) {
  return (
    <Link href={url} target="_blank" className="group">
      <div className="relative w-full aspect-[16/10] bg-red-500 rounded-lg sm:rounded-xl mb-2">
        <Image
          src={imageUrl}
          fill
          alt="afifudin"
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="dark:font-medium group-hover:underline">{title}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{year}</p>
      </div>
      <p className="dark:font-medium text-neutral-500 dark:text-neutral-400 mb-2 group-hover:underline">
        {description}
      </p>
      <div className="flex items-center gap-1 flex-wrap text-xs">
        {stacks.map((stack, i) => {
          return (
            <p
              key={title + i}
              className="font-medium dark:font-normal bg-secondary text-secondary-foreground py-1 px-2 rounded-md"
            >
              {stack}
            </p>
          )
        })}
      </div>
    </Link>
  )
}
