const notifications = [
  {
    id: 1,
    title: "New Like",
    description: "Someone liked your post.",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "New Comment",
    description: "You received a new comment.",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "New Follower",
    description: "A user started following you.",
    time: "1 hour ago",
  },
];

export default function Notifications() {
  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Notifications
      </h2>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">
                {item.title}
              </h3>

              <span className="text-xs text-slate-500">
                {item.time}
              </span>
            </div>

            <p className="mt-2 text-slate-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
