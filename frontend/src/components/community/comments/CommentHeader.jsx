import { Link } from "react-router-dom";
import VerificationBadge from "../../profile/VerificationBadge";

export default function CommentHeader({
  profile,
  createdAt,
}) {

  return (
    <div className="flex items-center gap-3">

      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.full_name}
          className="h-9 w-9 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {(profile.username || "Q")
            .charAt(0)
            .toUpperCase()}
        </div>
      )}

      <div>

        <Link
          to={`/profile/${profile.id}`}
          className="flex items-center gap-2 hover:text-blue-400 transition"
        >
          <span className="font-semibold text-white">
            {profile.full_name || "Quavron User"}
          </span>

          <VerificationBadge
            verified={!!profile.verification_type}
            type={profile.verification_type}
            size={16}
          />
        </Link>

        <p className="text-xs text-slate-400">
          @{profile.username || "user"}
        </p>

        <p className="text-xs text-slate-500">
          {new Date(createdAt).toLocaleString()}
        </p>

      </div>

    </div>
  );

}
