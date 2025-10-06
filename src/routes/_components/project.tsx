const projects = [
  {
    name: "Luct",
    description: "Segment lung area with AI",
    videoUrl: "/luct.mp4",
    year: 2024,
  },
  {
    name: "Unvolds",
    description: "Detect COVID-19 with AI",
    videoUrl: "/unvolds.mp4",
    year: 2023,
  },
];

export function Project() {
  return (
    <div className="py-8">
      <h2
        id="project"
        className="font-departure text-muted-foreground uppercase"
      >
        Projects
      </h2>
      <div className="font-departure grid gap-4 py-4 uppercase sm:grid-cols-2">
        {projects.map((project, i) => {
          return (
            <div
              key={i}
              className="border border-blue-500 bg-blue-50 transition-colors hover:bg-blue-100"
            >
              <p className="px-2 py-0.5 text-center text-[.5rem] text-blue-500">
                [ {project.name} ]
              </p>
              <div className="px-1 pb-1">
                <video
                  src={project.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="aspect-3/2 rounded-[.125rem] border border-blue-500 bg-neutral-100"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
