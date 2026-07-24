import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Users",
    description: "Manage all registered users.",
    path: "/admin/users",
  },
  {
    title: "Verification",
    description: "Review verification requests.",
    path: "/admin/verifications",
  },
  {
    title: "Reports",
    description: "Review reported posts and comments.",
    path: "/admin/reports",
  },
  {
    title: "Advertisements",
    description: "Manage advertising campaigns.",
    path: "/admin/ads",
  },
  {
    title: "Analytics",
    description: "Platform statistics.",
    path: "/analytics",
  },
  {
    title: "System",
    description: "Global platform settings.",
    path: "/admin/system",
  },
];

export default function AdminDashboard() {

  const navigate = useNavigate();

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Administration
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome to the Quavron Administration Panel.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => (

          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
              text-left
              transition-all
              duration-200
              hover:border-blue-500
              hover:bg-slate-800
              hover:scale-[1.02]
              active:scale-95
            "
          >

            <h2 className="text-lg font-semibold text-white">
              {card.title}
            </h2>

            <p className="mt-2 text-slate-400">
              {card.description}
            </p>

          </button>

        ))}

      </div>

    </div>
  );

}
