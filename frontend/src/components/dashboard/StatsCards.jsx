import {
  FolderOpen,
  Bot,
  Rocket,
  Users,
} from "lucide-react";

import Card from "../ui/Card";

const stats = [
  {
    title: "Projects",
    value: "12",
    icon: FolderOpen,
  },
  {
    title: "AI Requests",
    value: "1,284",
    icon: Bot,
  },
  {
    title: "Deployments",
    value: "36",
    icon: Rocket,
  },
  {
    title: "Community",
    value: "8.2K",
    icon: Users,
  },
];

export default function StatsCards() {
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

