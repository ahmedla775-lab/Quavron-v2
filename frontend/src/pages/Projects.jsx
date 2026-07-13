import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProjectService from "../services/ProjectService";
import AuthService from "../services/AuthService";
import { useProject } from "../context/ProjectContext";

export default function Projects() {

  const {
    project,
    setProject,
    renameProject,
    clearProject,
  } = useProject();
const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [creating, setCreating] = useState(false);

  const [newProject, setNewProject] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {

    loadProjects();

  }, []);

  async function loadProjects() {

    setLoading(true);

    const user = await AuthService.getUser();

    if (!user.data.user) {

      setLoading(false);

      return;

    }

    const { data, error } =
      await ProjectService.getProjects(
        user.data.user.id
      );

    if (!error) {

      setProjects(data || []);

    }

    setLoading(false);

  }

  async function createProject() {

    if (!newProject.trim()) return;

    setCreating(true);

    const user = await AuthService.getUser();

    if (!user.data.user) {

      setCreating(false);

      return;

    }

    const { data, error } =
      await ProjectService.createProject(

        user.data.user.id,

        newProject,

        ""

      );

    if (error) {

      setError(error.message);

      setCreating(false);

      return;

    }

    setProjects((prev) => [

      data,

      ...prev,

    ]);

    setNewProject("");

    setCreating(false);

  }

  async function removeProject(id) {

    const ok = window.confirm(

      "Delete this project?"

    );

    if (!ok) return;

    await ProjectService.deleteProject(id);

    setProjects((prev) =>
      prev.filter((p) => p.id !== id)
    );

    if (project?.id === id) {

      clearProject();

}
    }

  function openProject(item) {

  setProject(item);

  navigate("/ide");

}

  async function changeName(item) {

    const name = prompt(

      "Project name",

      item.name

    );

    if (!name) return;

    await ProjectService.updateProject(

      item.id,

      {

        name,

      }

    );

    renameProject(name);

    loadProjects();

  }

  const filteredProjects = useMemo(() => {

    return projects.filter((item) =>

      item.name
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  }, [projects, search]);

  return (    <DashboardLayout>

      <div className="space-y-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-white">
              Projects
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your Quavron projects.
            </p>

          </div>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Project name"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              onClick={createProject}
              disabled={creating}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? "Creating..." : "New Project"}
            </button>

          </div>

        </div>

        {error && (

          <div className="rounded-xl border border-red-700 bg-red-950 p-4 text-red-300">

            {error}

          </div>

        )}

        {loading ? (

          <div className="py-20 text-center text-slate-400">

            Loading projects...

          </div>

        ) : filteredProjects.length === 0 ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

            <h2 className="text-xl font-semibold text-white">

              No projects found

            </h2>

            <p className="mt-3 text-slate-400">

              Create your first Quavron project.

            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredProjects.map((item) => (

              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
              >

                <h3 className="text-xl font-bold text-white">

                  {item.name}

                </h3>

                <p className="mt-2 text-sm text-slate-400">

                  {item.description || "No description"}

                </p>

                <p className="mt-4 text-xs text-slate-500">

                  {item.updated_at}

                </p>

                <div className="mt-6 flex gap-2">

                  <button
                    onClick={() => openProject(item)}
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => changeName(item)}
                    className="rounded-lg bg-amber-600 px-3 py-2 text-white hover:bg-amber-700"
                  >
                    Rename
                  </button>

                  <button
                    onClick={() => removeProject(item.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </DashboardLayout>

  );

}
