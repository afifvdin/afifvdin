export function Work({
  company,
  start,
  end = "Present",
  role,
}: {
  company: string;
  start: string;
  end?: string;
  role: string;
}) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base">{company}</p>
        <p className="text-muted-foreground">
          {start} - {end}
        </p>
      </div>
      <p className="text-muted-foreground">{role}</p>
    </div>
  );
}
