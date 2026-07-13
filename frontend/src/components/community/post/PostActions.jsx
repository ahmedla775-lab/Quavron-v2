import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";

import { useState } from "react";

import useLike from "../../../modules/community/hooks/useLike";
import useBookmark from "../../../modules/community/hooks/useBookmark";

import CommentsDrawer from "../comments/CommentsDrawer";
import { useCommentsContext } from "../../../modules/community/context/CommentsContext";

import { useAuth } from "../../auth/AuthProvider";


export default function PostActions({ post }) {


  const { user } = useAuth();


  const { toggleLike } = useLike();


  const { toggleBookmark } = useBookmark();


  const {
    comments,
    loadComments,
    createComment,
  } = useCommentsContext();



  const [openComments, setOpenComments] =
    useState(false);


  const [likes, setLikes] =
    useState(post.likes_count ?? 0);


  const [liked, setLiked] =
    useState(false);



  async function handleLike() {

    const result =
      await toggleLike(post);


    if (result) {

      setLiked(true);

      setLikes((prev) => prev + 1);

    } else {

      setLiked(false);

      setLikes((prev) =>
        Math.max(0, prev - 1)
      );

    }

  }



  async function handleBookmark() {

    await toggleBookmark(post);

  }



  async function handleComments() {

    setOpenComments(true);

    await loadComments(post.id);

  }



  async function handleCreateComment(content) {

  if (!user) {
    console.log("NO USER");
    return;
  }

  try {

    const result = await createComment({
      post_id: post.id,
      author_id: user.id,
      content,
      parent_id: null,
    });

    console.log("SUCCESS:", result);

  } catch (error) {

    console.error("CREATE COMMENT FAILED:", error);

  }

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


        <button

          onClick={handleLike}

          className={`flex items-center gap-2 transition ${
            liked
              ? "text-red-500"
              : "text-slate-400 hover:text-red-500"
          }`}

        >

          <Heart

            size={20}

            fill={
              liked
                ? "currentColor"
                : "none"
            }

          />

          <span>

            {likes}

          </span>

        </button>



        <button

          onClick={handleComments}

          className="flex items-center gap-2 text-slate-400 hover:text-sky-500"

        >

          <MessageCircle size={20} />

          <span>

            {post.comments_count ?? 0}

          </span>

        </button>



        <button

          className="flex items-center gap-2 text-slate-400 hover:text-green-500"

        >

          <Share2 size={20} />

          <span>

            {post.shares_count ?? 0}

          </span>

        </button>



        <button

          onClick={handleBookmark}

          className="text-slate-400 hover:text-yellow-500"

        >

          <Bookmark size={20} />

        </button>


      </div>



      <CommentsDrawer

        open={openComments}

        comments={comments}

        onClose={() =>
          setOpenComments(false)
        }

        onSubmit={handleCreateComment}

        onReply={handleReply}

      />


    </>

  );

}
