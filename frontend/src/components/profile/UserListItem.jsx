import { Link } from "react-router-dom";
import VerificationBadge from "./VerificationBadge";

export default function UserListItem({

  profile,

  action,

}) {

  return (

    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3">

      <Link
        to={`/profile/${profile.id}`}
        className="flex flex-1 items-center gap-3"
      >

        <img
          src={
            profile.avatar_url ||
            "https://ui-avatars.com/api/?name=Q"
          }
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>

          <h3 className="flex items-center gap-2 font-semibold text-white">

            <span>
              {profile.full_name || "Quavron User"}
            </span>

            <VerificationBadge
              verified={!!profile.verification_type}
              type={profile.verification_type}
              size={16}
            />

          </h3>

          <p className="text-sm text-slate-400">

            @{profile.username}

          </p>

        </div>

      </Link>

      {action}

    </div>

  );

}
