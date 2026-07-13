import { useState } from "react";

export default function CreateComment({

  onSubmit,

  loading = false,

}) {

  const [content, setContent] =
    useState("");

  async function handleSubmit() {

    if (!content.trim()) return;

    await onSubmit(content);

    setContent("");

  }

  return (

    <div className="border-t border-slate-800 p-4">

      <textarea
        rows={2}
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        placeholder="Write a comment..."
        className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"
      />

      <div className="mt-3 flex justify-end">

        <button

          onClick={handleSubmit}

          disabled={loading}

          className="rounded-xl bg-blue-600 px-4 py-2 text-white"

        >

          {loading
            ? "Posting..."
            : "Comment"}

        </button>

      </div>

    </div>

  );

}
