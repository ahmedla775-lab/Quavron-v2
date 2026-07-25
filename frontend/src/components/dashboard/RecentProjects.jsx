import { useTranslation } from "react-i18next";

import Card from "../ui/Card";
import Button from "../ui/Button";

export default function RecentProjects() {
  const { t } = useTranslation("dashboard");

  const projects = [
    {
      id: 1,
      name: "Quavron Landing",
      language: "React",
      updated: t("twoHoursAgo"),
      status: t("active"),
    },
    {
      id: 2,
      name: "Cloud IDE",
      language: "TypeScript",
      updated: t("yesterday"),
      status: t("active"),
    },
    {
      id: 3,
      name: "AI Assistant",
      language: "Node.js",
      updated: t("threeDaysAgo"),
      status: t("inProgress"),
    },
  ];

  return (
    <Card>

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-xl font-bold lg:text-2xl">
          {t("recentProjects")}
        </h2>

        <Button size="sm">
          {t("newProject")}
        </Button>

      </div>

      <div className="space-y-3">

        {projects.map((project) => (

          <div
            key={project.id}
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
              transition
              hover:border-blue-500
            "
          >

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0 flex-1">

                <h3 className="truncate font-semibold text-white">
                  {project.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {project.language}
                </p>

              </div>

              <span
                className="
                  rounded-full
                  bg-blue-600/20
                  px-3
                  py-1
                  text-xs
                  text-blue-400
                "
              >
                {project.status}
              </span>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              {project.updated}
            </p>

          </div>

        ))}

      </div>

    </Card>
  );
}
