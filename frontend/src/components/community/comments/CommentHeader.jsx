import { Link } from "react-router-dom";
import VerificationBadge from "../../profile/VerificationBadge";

export default function CommentHeader({ comment }) {

  const profile = comment?.profiles ?? {};

  const fullName =
    profile.full_name ||
    comment?.full_name ||
    "Quavron User";

  const username =
    profile.username ||
    comment?.username ||
    "user";

  const avatar =
    profile.avatar_url ||
    comment?.avatar_url;

  return (
    <div className="flex items-center gap-3">

      {avatar ? (
        <img
          src={avatar}
          alt={fullName}
          className="h-9 w-9 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </div>
      )}

      <div>

        <Link
          to={`/profile/${comment?.author_id}`}
          className="flex items-center gap-2 transition hover:text-[var(--q-primary)]"
        >
          <span className="font-semibold text-[var(--q-text)]">
            {fullName}
          </span>

          <VerificationBadge
            verified={profile.verified}
            verificationType={profile.verification_type}
            size={16}
          />
        </Link>

        <p className="text-xs text-[var(--q-muted)]">
          @{username}
        </p>

        <p className="text-xs text-[var(--q-muted)]">
          {comment?.created_at
            ? new Date(comment.created_at).toLocaleString()
            : ""}
        </p>

      </div>

    </div>
  );
}
