import { useState } from "react";
import { Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { usePosts } from "../../context/PostContext";

import PostHeader from "./post/PostHeader";
import PostContent from "./post/PostContent";
import PostActions from "./post/PostActions";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    updatePost,
    deletePost,
  } = usePosts();

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);

  const isOwner = user?.id === post.author_id;

  const isLive = post.type === "live";

  async function handleSave() {
    await updatePost(post.id, {
      content,
    });

    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;

    await deletePost(post.id);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "Quavron",
        text: post.content,
        url: window.location.href,
      });

      return;
    }

    await navigator.clipboard.writeText(
      window.location.href
    );

    alert("Link copied");
  }

  function handleBookmark() {
    alert("Bookmark will be connected next");
  }

  return (
    <article
      className="
        w-full
        border-b
        border-[var(--q-border)]
        bg-[var(--q-bg)]
      "
    >
      {isLive && (
        <button
          onClick={() =>
            navigate("/community/watch/" + post.roomId)
          }
          className="
            flex
            w-full
            items-center
            justify-between
            bg-red-600
            px-4
            py-3
            text-white
          "
        >
          <div className="flex items-center gap-2">
            <Radio size={18} />
            LIVE NOW
          </div>

          <span>
            👁 {post.viewers ?? 0}
          </span>
        </button>
      )}

      <div className="px-4 py-5">

        <PostHeader
          post={post}
          isOwner={isOwner}
          onEdit={() => setEditing(true)}
          onDelete={handleDelete}
          onShare={handleShare}
          onBookmark={handleBookmark}
        />

        {editing ? (
          <div className="mt-4">

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="
                min-h-[120px]
                w-full
                rounded-xl
                border
                border-[var(--q-border)]
                bg-[var(--q-card)]
                p-4
                text-[var(--q-text)]
                outline-none
              "
            />

            <div className="mt-4 flex gap-2">

              <button
                onClick={handleSave}
                className="rounded-xl bg-[var(--q-primary)] px-5 py-2 text-white"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setContent(post.content);
                  setEditing(false);
                }}
                className="rounded-xl border border-[var(--q-border)] px-5 py-2"
              >
                Cancel
              </button>

            </div>

          </div>
        ) : (
          <PostContent post={post} />
        )}

        <PostActions post={post} />

      </div>

    </article>
  );
}
