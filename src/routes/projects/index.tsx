import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

const projects = [
  {
    name: "Luct",
    description: "Segment lung area with AI",
    videoUrl: "/luct.mp4",
  },
  {
    name: "Unvolds",
    description: "Detect COVID-19 with AI",
    videoUrl: "/unvolds.mp4",
  },
];

function RouteComponent() {
  return (
    <div className="p-4 sm:p-16">
      <div>
        <h1 className="font-departure text-3xl uppercase">Project</h1>
        <p>Past projects i worked on</p>
      </div>
      <div className="grid gap-x-4 gap-y-8 py-8 sm:grid-cols-2">
        {projects.map((project, i) => {
          return (
            <div key={i} className="flex flex-col gap-4 sm:flex-row">
              <div className="w-full border border-blue-500 bg-blue-50 transition-colors hover:bg-blue-100 sm:max-w-xs">
                <p className="font-departure px-2 py-0.5 text-center text-[.5rem] text-blue-500 uppercase">
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
              <div className="block">
                <h2 className="font-departure text-2xl uppercase">
                  {project.name}
                </h2>
                <p>{project.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
