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

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
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
          text-slate-400
          transition
          hover:bg-slate-800
          hover:text-white
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
            border-slate-700
            bg-slate-900
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
                  text-white
                  transition
                  hover:bg-slate-800
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
                  text-red-400
                  transition
                  hover:bg-slate-800
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
              text-white
              transition
              hover:bg-slate-800
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
              text-white
              transition
              hover:bg-slate-800
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
