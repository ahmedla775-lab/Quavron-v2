import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import { useEffect, useState } from "react";

import BookmarkService from "../../../modules/community/services/BookmarkService";
import useReaction from "../../../modules/community/hooks/useReaction";
import useBookmark from "../../../modules/community/hooks/useBookmark";
import useShare from "../../../modules/community/hooks/useShare";

import { REACTIONS } from "../../../modules/community/constants/reactions";

import ReactionPicker from "./ReactionPicker";
import ReactionSummary from "./ReactionSummary";
import ReactionUsersModal from "./ReactionUsersModal";

import CommentsDrawer from "../comments/CommentsDrawer";

import { useCommentsContext } from "../../../modules/community/context/CommentsContext";
import { useAuth } from "../../auth/AuthProvider";

import ReactionService from "../../../modules/community/services/ReactionService";

export default function PostActions({ post }) {

  const { user } = useAuth();

  const {
  reaction,
  loading,
  toggleReaction,
} = useReaction(post.id);

  const {
    toggleBookmark,
  } = useBookmark();

  const {
    share,
  } = useShare();

  const {
    comments,
    loadComments,
    createComment,
  } = useCommentsContext();

  const [openComments, setOpenComments] = useState(false);

  const [showReactions, setShowReactions] = useState(false);

  const [showUsersModal, setShowUsersModal] = useState(false);

  const [reactionUsers, setReactionUsers] = useState([]);

  const [reactionCounts, setReactionCounts] = useState({});

  const [shares, setShares] =
    useState(post.shares_count ?? 0);

  const [bookmarked, setBookmarked] =
    useState(false);

  const currentReaction =
    REACTIONS.find(
      (item) => item.type === reaction
    );

  useEffect(() => {
  loadReactionSummary();
  loadBookmarkState();
}, []);

  async function loadReactionSummary() {

    const counts =
      await ReactionService.countByReaction(post.id);

    setReactionCounts(counts);

  }

  async function loadReactionUsers() {

    const { data } =
      await ReactionService.getPostReactions(post.id);

    setReactionUsers(data ?? []);

    setShowUsersModal(true);

  }
async function loadBookmarkState() {
  if (!user) return;

  const { data } = await BookmarkService.isBookmarked(
    post.id,
    user.id
  );

  setBookmarked(!!data);
}
  async function handleReaction(type) {

    await toggleReaction(post, type);

    setShowReactions(false);

    await loadReactionSummary();

  }

  async function handleBookmark() {

    const result =
      await toggleBookmark(post);

    setBookmarked(result);

  }

  async function handleShare() {

    const result =
      await share(post);

    if (result) {

      setShares((prev) => prev + 1);

    }

  }

  async function handleComments() {

    setOpenComments(true);

    await loadComments(post.id);

  }

  async function handleCreateComment(content) {

    if (!user) return;

    await createComment({

      post_id: post.id,

      author_id: user.id,

      content,

      parent_id: null,

    });

  }

  async function handleReply(comment, content) {

    if (!user) return;

    await createComment({

      post_id: post.id,

      author_id: user.id,

      content,

      parent_id: comment.id,

    });

  }

  return (
    <>
      <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">

        {/* Reactions */}
        <div className="relative">

          <ReactionPicker
            visible={showReactions}
            onSelect={handleReaction}
          />

          <button
            onClick={() => setShowReactions((v) => !v)}
            className="flex items-center gap-2 text-slate-400 transition hover:text-red-500"
          >
            {currentReaction ? (
  <span className="text-xl">{currentReaction.emoji}</span>
) : (
  <ThumbsUp size={20} />
)}

            <span>
              {currentReaction
                ? currentReaction.label
                : "React"}
            </span>
          </button>

        </div>

        {/* Comments */}
        <button
          onClick={handleComments}
          className="flex items-center gap-2 text-slate-400 transition hover:text-sky-500"
        >
          <MessageCircle size={20} />
          <span>{post.comments_count ?? 0}</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-slate-400 transition hover:text-green-500"
        >
          <Share2 size={20} />
          <span>{shares}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={
            bookmarked
              ? "text-yellow-500"
              : "text-slate-400 transition hover:text-yellow-500"
          }
        >
          <Bookmark
            size={20}
            fill={bookmarked ? "currentColor" : "none"}
          />
        </button>

      </div>

      {/* Reaction Summary */}
      <div
        onClick={loadReactionUsers}
        className="cursor-pointer"
      >
        <ReactionSummary
          counts={reactionCounts}
        />
      </div>

      {/* Users Modal */}
      <ReactionUsersModal
        open={showUsersModal}
        users={reactionUsers}
        onClose={() => setShowUsersModal(false)}
      />

      {/* Comments */}
      <CommentsDrawer
        open={openComments}
        comments={comments}
        onClose={() => setOpenComments(false)}
        onSubmit={handleCreateComment}
        onReply={handleReply}
      />
    </>
  );
}
