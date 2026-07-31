import { Radio } from "lucide-react";
import GoLiveModal from "./live/GoLiveModal";

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
const [openLive, setOpenLive] = useState(false);
  function handleFiles(e) {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
  className="
    w-full
    border-b
    border border-[var(--q-border)]
    py-5
    dark:border-slate-800
  "
>
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening today?"
        className="
          w-full
          resize-none
          rounded-none
bg-transparent
p-4
text-[var(--q-text)]
outline-none
dark:text-white
          placeholder:text-slate-500
        "
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                bg-[var(--q-surface)]
                px-3
                py-2
              "
            >
              <span className="truncate text-sm text-white">
                {file.name}
              </span>

              <button
                onClick={() => removeFile(index)}
                className="text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
        "
      >
        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-blue-500">
            <Image size={20} />
            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
            />
          </label>

          <label className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-green-500">
            <Video size={20} />
            <input
              hidden
              type="file"
              accept="video/*"
              multiple
              onChange={handleFiles}
            />
          </label>

          <label className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-yellow-500">
            <Paperclip size={20} />
            <input
              hidden
              type="file"
              multiple
              onChange={handleFiles}
            />
          </label>

          <label className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-pink-500">
            <Music size={20} />
            <input
              hidden
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFiles}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">

  <button
    onClick={() => setOpenLive(true)}
    className="
      flex
      items-center
      gap-2
      rounded-xl
      bg-red-600
      px-5
      py-3
      font-semibold
      text-white
      transition
      hover:bg-red-700
    "
  >
    <Radio size={18} />
    Go Live
  </button>

  <button
    onClick={handlePost}
    disabled={loading}
    className="
      rounded-xl
      bg-blue-600
      px-5
      py-3
      font-semibold
      text-white
      transition
      hover:bg-blue-700
      disabled:opacity-50
    "
  >
    {loading ? "Posting..." : "Post"}
  </button>

</div>

<GoLiveModal
  open={openLive}
  onClose={() => setOpenLive(false)}
/>
      </div>
    </div>
  );
}
