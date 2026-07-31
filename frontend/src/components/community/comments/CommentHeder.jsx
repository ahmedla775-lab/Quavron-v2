import { useNavigate } from "react-router-dom";
import VerificationBadge from "../../profile/VerificationBadge";

export default function CommentHeader({
  comment,
}) {
  const navigate = useNavigate();

  const profile = comment.profiles || {};

  const fullName =
    profile.full_name ||
    comment.full_name ||
    "Quavron User";

  const username =
    profile.username ||
    comment.username ||
    "user";

  const avatar =
    profile.avatar_url ||
    comment.avatar_url;

  function openProfile() {
    navigate(`/profile/${comment.author_id}`);
  }

  return (
    <div className="flex items-center gap-3">
      <div
        onClick={openProfile}
        className="cursor-pointer shrink-0"
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
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <button
            onClick={openProfile}
            className="
              truncate
              font-semibold
              text-[var(--q-text)]
              transition
              hover:text-[var(--q-primary)]
            "
          >
            {fullName}
          </button>

          <VerificationBadge
            verified={profile.verified}
            verificationType={profile.verification_type}
            size={14}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span
            onClick={openProfile}
            className="
              cursor-pointer
              text-[var(--q-muted)]
              hover:text-[var(--q-primary)]
            "
          >
            @{username}
          </span>

          <span className="text-[var(--q-muted)]">
            •
          </span>

          <span className="text-[var(--q-muted)]">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
