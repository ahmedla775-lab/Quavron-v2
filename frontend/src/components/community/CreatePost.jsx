import { useState } from "react";

import {
  Image,
  Video,
  Paperclip,
  Music,
} from "lucide-react";

import { useAuth } from "../auth/AuthProvider";
import { usePosts } from "../../context/PostContext";

export default function CreatePost() {

  const { user } = useAuth();

  const { createPost } = usePosts();

  const [content, setContent] = useState("");

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  function handleFiles(e) {

    const selected = Array.from(e.target.files);

    setFiles((prev) => [
      ...prev,
      ...selected,
    ]);

  }

  function removeFile(index) {

    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

  }

  async function handlePost() {

    if (!user) return;

    if (!content.trim() && files.length === 0) return;

    setLoading(true);

    try {

      await createPost({
        authorId: user.id,
        content,
        files,
      });

      setContent("");

      setFiles([]);

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

      {files.length > 0 && (

        <div className="mt-4 space-y-2">

          {files.map((file, index) => (

            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2"
            >

              <span className="truncate text-sm text-white">
                {file.name}
              </span>

              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-400"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

      <div className="mt-4 flex items-center justify-between">

        <div className="flex gap-3">

          <label className="cursor-pointer text-slate-400 hover:text-blue-500">

            <Image size={22} />

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFiles}
            />

          </label>

          <label className="cursor-pointer text-slate-400 hover:text-green-500">

            <Video size={22} />

            <input
              type="file"
              accept="video/*"
              multiple
              hidden
              onChange={handleFiles}
            />

          </label>

          <label className="cursor-pointer text-slate-400 hover:text-yellow-500">

            <Paperclip size={22} />

            <input
              type="file"
              multiple
              hidden
              onChange={handleFiles}
            />

          </label>

          <label className="cursor-pointer text-slate-400 hover:text-pink-500">

            <Music size={22} />

            <input
              type="file"
              accept="audio/*"
              multiple
              hidden
              onChange={handleFiles}
            />

          </label>

        </div>

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
