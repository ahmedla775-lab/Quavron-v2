import Modal from "../../ui/Modal";
import UserRow from "./UserRow";

export default function FollowersModal({
  open,
  users = [],
  onClose,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--q-text)]">
            Followers
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-[var(--q-surface)] px-3 py-2 text-[var(--q-text)] hover:bg-[var(--q-card)]"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[500px] space-y-2 overflow-y-auto">
          {users.length === 0 ? (
            <p className="py-10 text-center text-[var(--q-muted)]">
              No followers yet.
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
    </Modal>
  );
}
