import {
  Key,
  Code2,
  Webhook,
  Shield,
  Cpu,
} from "lucide-react";

const items = [
  {
    icon: Key,
    title: "API Keys",
    description:
      "Generate and manage API Keys for external applications.",
    action: "Manage",
  },
  {
    icon: Code2,
    title: "Personal Access Tokens",
    description:
      "Create secure tokens for CLI and integrations.",
    action: "Create",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description:
      "Receive realtime events from Quavron.",
    action: "Configure",
  },
  {
    icon: Shield,
    title: "OAuth Applications",
    description:
      "Register OAuth applications and callback URLs.",
    action: "Manage",
  },
  {
    icon: Cpu,
    title: "Developer Console",
    description:
      "Logs, SDKs, API documentation and debugging tools.",
    action: "Open",
  },
];

export default function DeveloperSettings() {

  return (

    <div className="space-y-5">

      {items.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-slate-800 p-3">

                <Icon className="h-7 w-7 text-blue-400" />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-white">

                  {item.title}

                </h2>

                <p className="text-sm text-slate-400">

                  {item.description}

                </p>

              </div>

            </div>

            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500">

              {item.action}

            </button>

          </div>

        );

      })}

    </div>

  );

}
