import {
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const activities = [

  {
    id: 1,
    icon: CheckCircle,
    title: "Password Changed",
    description: "Your password was updated successfully.",
    date: "Today",
    color: "text-green-400",
  },

  {
    id: 2,
    icon: Shield,
    title: "Successful Login",
    description: "Chrome • Algeria",
    date: "Today",
    color: "text-blue-400",
  },

  {
    id: 3,
    icon: AlertTriangle,
    title: "Recovery Email Sent",
    description: "Password reset email requested.",
    date: "Yesterday",
    color: "text-yellow-400",
  },

];

export default function SecurityActivity() {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-bold text-white">

        Security Activity

      </h2>

      <div className="space-y-5">

        {activities.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.id}
              className="flex items-start gap-4"
            >

              <div className="rounded-xl bg-slate-800 p-3">

                <Icon className={`h-5 w-5 ${item.color}`} />

              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-white">

                  {item.title}

                </h3>

                <p className="text-sm text-slate-400">

                  {item.description}

                </p>

              </div>

              <span className="text-xs text-slate-500">

                {item.date}

              </span>

            </div>

          );

        })}

      </div>

    </div>

  );

}
