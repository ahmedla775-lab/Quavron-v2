import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import VerificationBadge from "../../profile/VerificationBadge";

export default function ReactionUsersModal({
  open,
  users = [],
  onClose,
}) {
  const navigate = useNavigate();

  if (!open) return null;

  function openProfile(user) {
    navigate(`/profile/${user.author_id || user.id}`);
    onClose?.();
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-lg
          overflow-hidden
          rounded-2xl
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--q-border)]
            p-4
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[var(--q-text)]
            "
          >
            Reactions
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-[var(--q-muted)]
              transition
              hover:bg-[var(--q-card)]
              hover:text-[var(--q-text)]
            "
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="
            max-h-[70vh]
            overflow-y-auto
          "
        >
          {users.length === 0 ? (
            <div
              className="
                p-8
                text-center
                text-[var(--q-muted)]
              "
            >
              No reactions yet.
            </div>
          ) : (
            users.map((item, index) => {
              const profile = item.profiles || {};

              const fullName =
                profile.full_name ||
                item.full_name ||
                "Quavron User";

              const username =
                profile.username ||
                item.username ||
                "user";

              const avatar =
                profile.avatar_url ||
                item.avatar_url;

              return (
                <button
                  key={index}
                  onClick={() => openProfile(item)}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    border-b
                    border-[var(--q-border)]
                    p-4
                    text-left
                    transition
                    hover:bg-[var(--q-card)]
                  "
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={fullName}
                      className="
                        h-10
                        w-10
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--q-primary)]
                        font-bold
                        text-white
                      "
                    >
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="
                          truncate
                          font-semibold
                          text-[var(--q-text)]
                        "
                      >
                        {fullName}
                      </span>

                      <VerificationBadge
                        verified={profile.verified}
                        verificationType={profile.verification_type}
                        size={14}
                      />
                    </div>

                    <div
                      className="
                        text-sm
                        text-[var(--q-muted)]
                      "
                    >
                      @{username}
                    </div>
                  </div>

                  <div className="text-xl">
                    {item.reaction_emoji}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
