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

  return (
    <div className="flex items-start gap-3">

      {post.avatar_url ? (
        <img
          src={post.avatar_url}
          alt={post.full_name}
          onClick={openProfile}
          className="h-11 w-11 cursor-pointer rounded-full object-cover"
        />
      ) : (
        <div
          onClick={openProfile}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-blue-600 font-bold text-white"
        >
          {(post.username || "Q")
            .charAt(0)
            .toUpperCase()}
        </div>
      )}

      <div className="flex-1">

        <div
          onClick={openProfile}
          className="flex cursor-pointer items-center gap-2"
        >
          <h3 className="font-semibold text-white transition hover:text-blue-400">
            {post.full_name || "Quavron User"}
          </h3>

<VerificationBadge
  verified={post.profiles?.verified}
  type={post.profiles?.verification_type}
  size={18}
/>          
        </div>

        <p
          onClick={openProfile}
          className="cursor-pointer text-sm text-slate-400 transition hover:text-blue-400"
        >
          @{post.username || "user"}
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
