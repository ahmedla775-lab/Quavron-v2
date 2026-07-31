import useResponsive from "../../../hooks/useResponsive";

import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";

export default function CommentsDrawer({
  open,
  comments,
  onClose,
  onSubmit,
  onReply,
  inline = false,
}) {
  const { isDesktop } = useResponsive();

  if (!open) return null;

  /* Mobile / Inline */

  if (!isDesktop || inline) {
    return (
      <div
        className="
          mt-4
          border-t
          border-[var(--q-border)]
          pt-4
        "
      >
        <CreateComment
          onSubmit={onSubmit}
        />

        <CommentsList
          comments={comments}
          onReply={onReply}
        />
      </div>
    );
  }

  /* Desktop Drawer */

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        justify-end
        bg-black/50
      "
    >
      <div
        className="
          h-full
          w-full
          max-w-md
          overflow-y-auto
          border-l
          border-[var(--q-border)]
          bg-[var(--q-surface)]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--q-border)]
            p-4
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-[var(--q-text)]
            "
          >
            Comments
          </h2>

          <button
            onClick={onClose}
            className="
              text-[var(--q-muted)]
              hover:text-[var(--q-text)]
            "
          >
            ✕
          </button>
        </div>

        <CreateComment
          onSubmit={onSubmit}
        />

        <CommentsList
          comments={comments}
          onReply={onReply}
        />
      </div>
    </div>
  );
}
