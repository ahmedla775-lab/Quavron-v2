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

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <Card key={item.title}>

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>

              </div>

              <div className="rounded-xl bg-blue-600/20 p-4">

                <Icon
                  size={28}
                  className="text-blue-400"
                />

              </div>

            </div>

          </Card>

        );

      })}

    </div>

  );

}
