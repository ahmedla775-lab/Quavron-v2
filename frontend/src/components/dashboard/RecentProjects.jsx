import Card from "../ui/Card";
import Button from "../ui/Button";

const projects = [
  {
    id: 1,
    name: "Quavron Landing",
    language: "React",
    updated: "2 hours ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Cloud IDE",
    language: "TypeScript",
    updated: "Yesterday",
    status: "Active",
  },
  {
    id: 3,
    name: "AI Assistant",
    language: "Node.js",
    updated: "3 days ago",
    status: "In Progress",
  },
];

export default function RecentProjects() {
  return (
    <Card>

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          Recent Projects
        </h2>

        <Button size="sm">
          New Project
        </Button>

      </div>

      <div className="space-y-4">

        {projects.map((project) => (

          <div
            key={project.id}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500"
          >

            <div>

              <h3 className="font-semibold text-white">

                {project.name}

              </h3>

              <p className="mt-1 text-sm text-slate-400">

                {project.language}

              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-blue-400">

                {project.status}

              </p>

              <p className="mt-1 text-xs text-slate-500">

                {project.updated}

              </p>

            </div>

          </div>

        ))}

      </div>

    </Card>
  );
}

