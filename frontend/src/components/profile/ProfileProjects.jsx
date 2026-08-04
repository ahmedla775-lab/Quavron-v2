import { FolderKanban, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileProjects({ profile }) {

  const projects = profile?.projects || [];

  return (

    <div className="mt-8">

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <h2 className="text-2xl font-bold text-[var(--q-text)]">

          Projects

        </h2>

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-[var(--q-text)] transition hover:bg-blue-700"
        >

          <Plus size={18} />

          New Project

        </Link>

      </div>

      {projects.length === 0 ? (

        <div className="rounded-3xl border border-[var(--q-border)] bg-[var(--q-surface)] p-12 text-center">

          <FolderKanban
            size={64}
            className="mx-auto mb-6 text-[var(--q-muted)]"
          />

          <h3 className="text-2xl font-bold text-[var(--q-text)]">

            No Projects Yet

          </h3>

          <p className="mt-3 text-[var(--q-muted)]">

            Create your first Quavron project.

          </p>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (

            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="rounded-3xl border border-[var(--q-border)] bg-[var(--q-surface)] p-6 transition hover:border-blue-500"
            >

              <h3 className="text-xl font-semibold text-[var(--q-text)]">

                {project.name}

              </h3>

              <p className="mt-3 text-[var(--q-muted)]">

                {project.description}

              </p>

            </Link>

          ))}

        </div>

      )}

    </div>

  );

}
