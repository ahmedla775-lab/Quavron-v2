import { X } from "lucide-react";
import VerificationBadge from "../../profile/VerificationBadge";
import { REACTIONS } from "../../../modules/community/constants/reactions";

export default function ReactionUsersModal({
  open,
  users = [],
  onClose,
}) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          z-40
          bg-black/60
        "
      />

      <div
        className="
          fixed
          left-1/2
          top-1/2
          z-50
          w-[95%]
          max-w-lg
          -translate-x-1/2
          -translate-y-1/2
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
          shadow-2xl
        "
      >

        <div className="flex items-center justify-between border-b border-slate-800 p-4">

          <h2 className="text-lg font-semibold">
            Reactions
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={22} />
          </button>

        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">

          {REACTIONS.map((reaction) => {
            const list = users.filter(
              (item) => item.reaction === reaction.type
            );

            if (list.length === 0) {
              return null;
            }

            return (
              <div
                key={reaction.type}
                className="mb-6"
              >

                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">

                  <span>{reaction.emoji}</span>

                  <span>{reaction.label}</span>

                  <span className="text-slate-400">
                    ({list.length})
                  </span>

                </h3>

                <div className="space-y-2">

                  {list.map((item, index) => {
                    const profile = item.profiles ?? {};

                    return (
                      <div
                        key={index}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          bg-slate-800
                          p-3
                        "
                      >

                        <img
                          src={
                            profile.avatar_url ||
                            "https://ui-avatars.com/api/?name=User"
                          }
                          alt=""
                          className="h-10 w-10 rounded-full"
                        />

                        <div>

                          <div className="font-medium">
                            <div className="flex items-center gap-2">
  <span>
    {profile.full_name || "User"}
  </span>

  <VerificationBadge
    verified={profile.verified}
    verificationType={profile.verification_type}
    size={15}
  />
</div>
                          </div>

                          <div className="text-sm text-slate-400">
                            @{profile.username || "unknown"}
                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </>
  );
}
