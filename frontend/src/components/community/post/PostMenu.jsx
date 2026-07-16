import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Share2, Bookmark } from "lucide-react";

export default function PostMenu({
  isOwner,
  onEdit,
  onDelete,
  onShare,
  onBookmark,
}) {

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (

        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">

          {isOwner && (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  onEdit?.();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-white hover:bg-slate-800"
              >
                <Pencil size={18} />
                Edit Post
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  onDelete?.();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-slate-800"
              >
                <Trash2 size={18} />
                Delete Post
              </button>
            </>
          )}

          <button
            onClick={() => {
              setOpen(false);
              onShare?.();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-white hover:bg-slate-800"
          >
            <Share2 size={18} />
            Share
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onBookmark?.();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-white hover:bg-slate-800"
          >
            <Bookmark size={18} />
            Save Post
          </button>

        </div>

      )}

    </div>
  );

}
