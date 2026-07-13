import {

  Heart,

  Reply,

  MoreHorizontal,

} from "lucide-react";

export default function CommentActions({

  comment,

}) {

  return (

    <div className="flex items-center gap-6 text-slate-400">

      <button className="flex items-center gap-2 hover:text-red-500">

        <Heart size={18} />

        <span>

          {comment.likes_count ?? 0}

        </span>

      </button>

      <button className="flex items-center gap-2 hover:text-blue-500">

        <Reply size={18} />

        <span>

          Reply

        </span>

      </button>

      <button className="hover:text-white">

        <MoreHorizontal size={18} />

      </button>

    </div>

  );

}
