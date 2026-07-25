import { useNavigate } from "react-router-dom";
import VerificationBadge from "../../profile/VerificationBadge";
import PostMenu from "./PostMenu";

export default function PostHeader({
  post,
  isOwner = false,
  onEdit,
  onDelete,
  onShare,
  onBookmark,
}) {
  const navigate = useNavigate();

  function openProfile() {
    navigate(`/profile/${post.author_id}`);
  }

  const profile = post.profiles || {};

  const fullName =
    profile.full_name ||
    post.full_name ||
    "Quavron User";

  const username =
    profile.username ||
    post.username ||
    "user";

  const avatar =
    profile.avatar_url ||
    post.avatar_url;

  return (
    <div className="flex items-start gap-3">

      <div
        onClick={openProfile}
        className="shrink-0 cursor-pointer"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={fullName}
            className="
              h-11
              w-11
              rounded-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-blue-600
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

          <h3
            onClick={openProfile}
            className="
              truncate
              cursor-pointer
              font-semibold
              text-white
              hover:text-blue-400
            "
          >
            {fullName}
          </h3>

          <VerificationBadge
            verified={profile.verified}
            verificationType={profile.verification_type}
            size={16}
          />

        </div>

        <p
          onClick={openProfile}
          className="
            truncate
            cursor-pointer
            text-sm
            text-slate-400
            hover:text-blue-400
          "
        >
          @{username}
        </p>

        <p className="text-xs text-slate-500">
          {new Date(post.created_at).toLocaleString()}
        </p>

      </div>

      <PostMenu
        isOwner={isOwner}
        onEdit={onEdit}
        onDelete={onDelete}
        onShare={onShare}
        onBookmark={onBookmark}
      />

    </div>
  );
}
