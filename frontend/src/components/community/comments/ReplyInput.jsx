import { useState } from "react";
import { SendHorizontal, X } from "lucide-react";

export default function ReplyInput({
  onSubmit,
  onCancel,
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
        mt-4
        rounded-2xl
        border
        border-[var(--q-border)]
       bg-[var(--q-comment)]
        p-4
      "
    >
      <textarea
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="
          w-full
          resize-none
          rounded-xl
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          px-4
          py-3
          text-[var(--q-text)]
          outline-none
          transition
          placeholder:text-[var(--q-muted)]
          focus:border-[var(--q-primary)]
        "
      />

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            text-[var(--q-muted)]
            transition
            hover:bg-[var(--q-surface)]
            hover:text-[var(--q-text)]
          "
        >
          <X size={18} />
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[var(--q-primary)]
            px-5
            py-2
            font-medium
            text-white
            transition
            hover:scale-105
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <SendHorizontal size={18} />

          {loading ? "Sending..." : "Reply"}
        </button>
      </div>
    </div>
  );
}
