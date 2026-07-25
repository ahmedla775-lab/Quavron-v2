import {
  FolderOpen,
  Bot,
  Rocket,
  Users,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Card from "../ui/Card";

export default function StatsCards() {
  const { t } = useTranslation("dashboard");

  const stats = [
    {
      title: t("projects"),
      value: "12",
      icon: FolderOpen,
    },
    {
      title: t("aiRequests"),
      value: "1,284",
      icon: Bot,
    },
    {
      title: t("deployments"),
      value: "36",
      icon: Rocket,
    },
    {
      title: t("community"),
      value: "8.2K",
      icon: Users,
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3

        lg:grid-cols-4
        lg:gap-6
      "
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="
              p-4
              lg:p-6
            "
          >
            <div className="flex items-center justify-between">

              <div>

                <p
                  className="
                    text-xs
                    text-slate-400
                    lg:text-sm
                  "
                >
                  {item.title}
                </p>

                <h2
                  className="
                    mt-2
                    text-xl
                    font-bold

                    lg:text-3xl
                  "
                >
                  {item.value}
                </h2>

              </div>

              <div
                className="
                  rounded-xl
                  bg-blue-600/20
                  p-2

                  lg:p-4
                "
              >
                <Icon
                  size={22}
                  className="text-blue-400 lg:h-7 lg:w-7"
                />
              </div>

            </div>

          </Card>
        );
      })}
    </div>
  );
}
