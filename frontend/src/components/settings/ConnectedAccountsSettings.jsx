import {
  GitBranch,
  Globe,
  Briefcase,
} from "lucide-react";

const accounts = [
  {
    id: "github",
    icon: GitBranch,
    title: "GitHub",
    description: "Connect your GitHub account.",
    connected: false,
  },
  {
    id: "google",
    icon: Globe,
    title: "Google",
    description: "Sign in with your Google account.",
    connected: false,
  },
  {
    id: "linkedin",
    icon: Briefcase,
    title: "LinkedIn",
    description: "Import your professional profile.",
    connected: false,
  },
];

export default function ConnectedAccountsSettings() {
  return (
    <div className="space-y-5">
      {accounts.map((account) => {
        const Icon = account.icon;

        return (
          <div
            key={account.id}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center gap-5">
              <div className="rounded-xl bg-slate-800 p-3">
                <Icon className="h-7 w-7 text-blue-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {account.title}
                </h3>

                <p className="text-sm text-slate-400">
                  {account.description}
                </p>
              </div>
            </div>

            <button
              className={`rounded-xl px-6 py-3 font-semibold transition ${
                account.connected
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {account.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
