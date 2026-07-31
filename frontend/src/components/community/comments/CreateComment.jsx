import { useState } from "react";
import { SendHorizontal } from "lucide-react";
export default function CreateComment({
  onSubmit,
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) return;

    setLoading(true);

    try {
      await onSubmit?.(content);

      setContent("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        border-t
        border-[var(--q-border)]
        pt-4
      "
    >
      <div
        className="
          flex
          items-end
          gap-3
        "
      >
        <textarea
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="
            flex-1
            resize-none
            rounded-2xl
            border
            border-[var(--q-border)]
            bg-[var(--q-comment)]
            px-4
            py-3
            text-[var(--q-text)]
            outline-none
            transition
            placeholder:text-[var(--q-muted)]
            focus:border-[var(--q-primary)]
          "
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-[var(--q-primary)]
            text-white
            transition
            hover:scale-105
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
