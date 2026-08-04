import CommentService from "../../../modules/community/services/CommentService";
import ShareService from "../../../modules/community/services/ShareService";
import useResponsive from "../../../hooks/useResponsive";

import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

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

  const { isDesktop } = useResponsive();


  const {
    reaction,
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

  const [animateReaction, setAnimateReaction] = useState(false);

  const pickerRef = useRef(null);

  const [showUsersModal, setShowUsersModal] = useState(false);

  const [reactionUsers, setReactionUsers] = useState([]);

  const [reactionCounts, setReactionCounts] = useState({});


  const [shares, setShares] = useState(
    post.shares_count ?? 0
  );


  const [commentsCount, setCommentsCount] = useState(
    post.comments_count ?? 0
  );

  const [sharesCount, setSharesCount] = useState(
    post.shares_count ?? 0
  );

  const [bookmarkCount, setBookmarkCount] = useState(
    post.bookmarks_count ?? 0
  );


  const [bookmarked, setBookmarked] = useState(false);


  const currentReaction =
    REACTIONS.find(
      (item) => item.type === reaction
    );


  const likesCount = reactionCounts?.LIKE ?? 0;

  const reactionsTotal =
    Object.values(reactionCounts ?? {}).reduce(
      (sum, value) => sum + value,
      0
    );



  useEffect(() => {

    loadReactionSummary();

    loadBookmarkState();

    loadCommentsCount();

    loadSharesCount();

    loadBookmarkCount();

    loadReactionSummary();

  }, []);



  useEffect(() => {

    function handleClick(e) {

      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {

        setShowReactions(false);

      }

    }


    document.addEventListener(
      "mousedown",
      handleClick
    );


    document.addEventListener(
      "touchstart",
      handleClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClick
      );


      document.removeEventListener(
        "touchstart",
        handleClick
      );

    };


  }, []);




  async function loadReactionSummary() {

    const counts =
      await ReactionService.countByReaction(
        post.id
      );


    console.log("REACTION COUNTS", counts);
    console.log("REACTION COUNTS", counts);
    setReactionCounts(counts ?? {});

  }




  async function loadReactionUsers() {

    const { data } =
      await ReactionService.getPostReactions(
        post.id
      );


    setReactionUsers(data ?? []);

    setShowUsersModal(true);

  }




  async function loadBookmarkState() {

    if (!user) return;


    const { data } =
      await BookmarkService.isBookmarked(
        post.id,
        user.id
      );


    setBookmarked(!!data);

  }




  async function loadCommentsCount() {

    const { count } =
      await CommentService.countComments(
        post.id
      );


    setCommentsCount(count ?? 0);

  }




  async function loadSharesCount() {

    const { count } =
      await ShareService.countShares(
        post.id
      );


    setSharesCount(count ?? 0);

  }





  async function loadBookmarkCount() {

    const { count } =
      await BookmarkService.countBookmarks(
        post.id
      );

    setBookmarkCount(count ?? 0);

  }


  async function handleReaction(type) {

    await toggleReaction(post, type);


    setAnimateReaction(true);


    setTimeout(() => {

      setAnimateReaction(false);

    }, 350);


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

      await loadSharesCount();

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


    await loadCommentsCount();

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
      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-[var(--q-border)]
          pt-4
        "
      >

        {/* Reactions */}

        <div
          ref={pickerRef}
          className="relative"
        >

          <ReactionPicker
            visible={showReactions}
            onSelect={handleReaction}
          />


          <button
            onClick={() => setShowReactions((v) => !v)}
            className="
              flex
              items-center
              gap-2
              text-[var(--q-muted)]
              transition
              hover:text-[var(--q-accent)]
            "
          >

            <span
              className={`
                text-xl
                transition-all
                duration-300
                ${animateReaction ? "scale-150" : "scale-100"}
              `}
            >

              {currentReaction
                ? currentReaction.emoji
                : <ThumbsUp size={20} />
              }

            </span>


            <span>

              {currentReaction
                ? currentReaction.label
                : "React"
              }

            </span>

            <span>{reactionsTotal}</span>

          </button>

        </div>



        {/* Comments */}

        <button
          onClick={handleComments}
          className="
            flex
            items-center
            gap-2
            text-[var(--q-muted)]
            transition
            hover:text-[var(--q-primary)]
          "
        >

          <MessageCircle size={20} />

          <span>
            {commentsCount}
          </span>

        </button>




        {/* Share */}

        <button
          onClick={handleShare}
          className="
            flex
            items-center
            gap-2
            text-[var(--q-muted)]
            transition
            hover:text-green-500
          "
        >

          <Share2 size={20} />

          <span>
            {sharesCount}
          </span>

        </button>




        {/* Bookmark */}

        <button
          onClick={handleBookmark}
          className={
            bookmarked
              ? "text-yellow-500"
              : "text-[var(--q-muted)] transition hover:text-yellow-500"
          }
        >

          <Bookmark
            size={20}
            fill={
              bookmarked
                ? "currentColor"
                : "none"
            }
          />

          <span>
            {bookmarkCount}
          </span>

        </button>


      </div>





      <div
        onClick={loadReactionUsers}
        className="cursor-pointer"
      >

        <ReactionSummary
          counts={reactionCounts}
        />

      </div>





      <ReactionUsersModal
        open={showUsersModal}
        users={reactionUsers}
        onClose={() =>
          setShowUsersModal(false)
        }
      />






      {/* Desktop Comments */}

      {isDesktop && (

        <CommentsDrawer

          open={openComments}

          comments={comments}

          onClose={() =>
            setOpenComments(false)
          }

          onSubmit={handleCreateComment}

          onReply={handleReply}

        />

      )}






      {/* Mobile Comments */}

      {!isDesktop && openComments && (

        <CommentsDrawer

          inline

          open

          comments={comments}

          onClose={() =>
            setOpenComments(false)
          }

          onSubmit={handleCreateComment}

          onReply={handleReply}

        />

      )}



    </>
  );

}
