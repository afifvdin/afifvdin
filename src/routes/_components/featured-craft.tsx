import { Button } from "@/components/ui/button";

const crafts = [
  {
    name: "Yer",
    description: "Simple part-of-speech tagger built with React",
    videoUrl: "/yer.mp4",
    url: "https://yer.afifvdin.com",
  },
  {
    name: "Kave",
    description: "Simple keycastr-like for linux",
    videoUrl: "/kave.mp4",
    url: "https://github.com/afifvdin/kave",
  },
];

export function FeaturedCraft() {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="featured-crafts"
          className="font-departure text-muted-foreground uppercase"
        >
          Featured craft
        </h2>
        <Button asChild variant="link" size="sm">
          <a href="/crafts">See them all</a>
        </Button>
      </div>
      <div className="grid gap-4 py-4 sm:grid-cols-2">
        {crafts.map((craft, i) => {
          return (
            <a
              target="_blank"
              href={craft.url}
              key={i}
              className="border border-blue-500"
            >
              <div className="p-4">
                <h3 className="font-departure text-base text-blue-500 uppercase">
                  {craft.name}
                </h3>
                <p>{craft.description}</p>
              </div>
              <video
                src={craft.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="aspect-3/2 bg-neutral-300"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
