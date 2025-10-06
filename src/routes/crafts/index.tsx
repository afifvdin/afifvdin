import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/crafts/")({
  component: RouteComponent,
});

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
  {
    name: "Minigrep",
    description: "Mini grep written in rust",
    videoUrl: "/minigrep.mp4",
    url: "https://github.com/afifvdin/minigrep-rs",
  },
];

function RouteComponent() {
  return (
    <div className="p-4 sm:p-16">
      <div>
        <h1 className="font-departure text-3xl uppercase">Craft</h1>
        <p>Curated list of things i built and use</p>
      </div>
      <div className="grid gap-x-4 gap-y-8 py-8 sm:grid-cols-2">
        {crafts.map((craft, i) => {
          return (
            <a
              target="_blank"
              href={craft.url}
              key={i}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <div className="w-full border border-blue-500 bg-blue-50 transition-colors hover:bg-blue-100 sm:max-w-xs">
                <p className="font-departure px-2 py-0.5 text-center text-[.5rem] text-blue-500 uppercase">
                  [ {craft.name} ]
                </p>
                <div className="px-1 pb-1">
                  <video
                    src={craft.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="aspect-3/2 rounded-[.125rem] border border-blue-500 bg-neutral-100"
                  />
                </div>
              </div>
              <div className="block">
                <h2 className="font-departure text-2xl uppercase">
                  {craft.name}
                </h2>
                <p>{craft.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
