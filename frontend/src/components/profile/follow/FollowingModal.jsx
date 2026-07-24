import UserRow from "./UserRow";

export default function FollowingModal({
  open,
  users = [],
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-lg rounded-3xl bg-slate-900 p-6">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Following
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-2 text-white"
          >
            ✕
          </button>

        </div>

        <div className="max-h-[500px] space-y-2 overflow-y-auto">

          {users.length === 0 ? (
            <p className="py-10 text-center text-slate-400">
              Not following anyone yet.
            </p>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id || user.profiles?.id}
                user={user}
              />
            ))
          )}

        </div>

      </div>

    </div>
  );
}
