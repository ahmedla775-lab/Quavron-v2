import { useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { usePosts } from "../../context/PostContext";

export default function CreatePost() {

  const { user } = useAuth();

  const { createPost } = usePosts();

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);

  async function handlePost() {

    if (!user) return;

    if (!content.trim()) return;

    setLoading(true);

    try {

      await createPost({

        authorId: user.id,

        content,

      });

      setContent("");

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="border-b border-slate-800 bg-slate-900 p-4">

      <textarea
        rows="3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening today?"
        className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"
      />

      <div className="mt-4 flex justify-end">

        <button
          onClick={handlePost}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >

          {loading ? "Posting..." : "Post"}

        </button>

      </div>

    </div>

  );

}
