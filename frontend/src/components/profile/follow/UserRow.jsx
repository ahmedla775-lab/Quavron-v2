import VerificationBadge from "../VerificationBadge";
import { Link } from "react-router-dom";

export default function UserRow({ user }) {
  const profile = user?.profiles || user;

  if (!profile) return null;

  return (
    <Link
      to={`/profile/${profile.id}`}
      className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
    >
      <img
        src={
          profile.avatar_url ||
          "https://ui-avatars.com/api/?background=2563eb&color=fff&name=" +
            encodeURIComponent(profile.username || "Q")
        }
        alt=""
        className="h-12 w-12 rounded-full object-cover"
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">

  <h3 className="font-semibold text-white">
    {profile.full_name || "Quavron User"}
  </h3>

  <VerificationBadge
    verified={profile.verified}
    type={profile.verification_type}
  />

</div>

        <p className="text-sm text-slate-400">
          @{profile.username}
        </p>
      </div>
    </Link>
  );
}
