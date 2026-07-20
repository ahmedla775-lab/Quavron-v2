import { useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { usePosts } from "../../context/PostContext";

import PostHeader from "./post/PostHeader";
import PostContent from "./post/PostContent";
import PostActions from "./post/PostActions";


export default function PostCard({ post }) {

  const { user } = useAuth();

  const {
    updatePost,
    deletePost,
  } = usePosts();


  const [editing, setEditing] = useState(false);

  const [content, setContent] = useState(
    post.content
  );


  const isOwner =
    user?.id === post.author_id;



  async function handleSave() {

    await updatePost(post.id, {
      content,
    });

    setEditing(false);

  }



  async function handleDelete() {

    const ok = confirm(
      "Delete this post?"
    );

    if (!ok) return;

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

    alert(
      "Bookmark will be connected next"
    );

  }



  return (

    <article
      className="
        w-full
        min-w-0
        overflow-hidden
        border-y
        border-slate-800
        bg-slate-900
        p-4
        shadow-sm
        transition

        sm:rounded-2xl
        sm:border
        sm:p-5

        hover:border-slate-700
      "
    >


      <PostHeader

        post={post}

        isOwner={isOwner}

        onEdit={() =>
          setEditing(true)
        }

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
              border-slate-700
              bg-slate-950
              p-4
              text-white
            "

          />



          <div className="mt-3 flex gap-2">


            <button

              onClick={handleSave}

              className="
                rounded-lg
                bg-blue-600
                px-4
                py-2
                text-white
              "

            >

              Save

            </button>



            <button

              onClick={() => {

                setContent(post.content);

                setEditing(false);

              }}

              className="
                rounded-lg
                bg-slate-700
                px-4
                py-2
                text-white
              "

            >

              Cancel

            </button>


          </div>


        </div>


      ) : (

        <PostContent post={post} />

      )}



      <PostActions post={post} />


    </article>

  );

}
