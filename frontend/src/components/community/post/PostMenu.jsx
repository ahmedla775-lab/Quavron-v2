import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Share2,
  Bookmark,
} from "lucide-react";

export default function PostMenu({
  isOwner,
  onEdit,
  onDelete,
  onShare,
  onBookmark,
}) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "touchstart",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "touchstart",
        handleClickOutside
      );
    };
  }, []);

  function close(callback) {
    setOpen(false);
    callback?.();
  }

  return (
    <div
      ref={menuRef}
      className="relative shrink-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          rounded-xl
          p-2
          text-[var(--q-muted)]
          transition-all
          hover:bg-[var(--q-card)]
          hover:text-[var(--q-text)]
        "
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-full
            z-50
            mt-2
            w-56
            overflow-hidden
            rounded-2xl
            border
            border-[var(--q-border)]
            bg-[var(--q-surface)]
            shadow-2xl
          "
        >
          {isOwner && (
            <>
              <button
                onClick={() => close(onEdit)}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  text-[var(--q-text)]
                  transition-colors
                  hover:bg-[var(--q-card)]
                "
              >
                <Pencil size={18} />
                Edit Post
              </button>

              <button
                onClick={() => close(onDelete)}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  text-[var(--q-accent)]
                  transition-colors
                  hover:bg-[var(--q-card)]
                "
              >
                <Trash2 size={18} />
                Delete Post
              </button>
            </>
          )}

          <button
            onClick={() => close(onShare)}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-[var(--q-text)]
              transition-colors
              hover:bg-[var(--q-card)]
            "
          >
            <Share2 size={18} />
            Share
          </button>

          <button
            onClick={() => close(onBookmark)}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-[var(--q-text)]
              transition-colors
              hover:bg-[var(--q-card)]
            "
          >
            <Bookmark size={18} />
            Save Post
          </button>
        </div>
      )}
    </div>
  );
}
