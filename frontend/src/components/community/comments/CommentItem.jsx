import CommentHeader from "./CommentHeader";
import CommentContent from "./CommentContent";
import CommentActions from "./CommentActions";
import ReplyInput from "./ReplyInput";

import { useState } from "react";

export default function CommentItem({
  comment,
  onReply,
}) {
  const [replying, setReplying] = useState(false);

  const replies = comment.replies ?? [];

  async function handleReply(content) {
    await onReply?.(comment, content);
    setReplying(false);
  }

  return (
    <div
      className="
  py-2
"
>
      <CommentHeader comment={comment} />

      <CommentContent comment={comment} />

      <CommentActions
        comment={comment}
        replying={replying}
        onReply={() => setReplying((v) => !v)}
      />

      {replying && (
        <div className="mt-3">
          <ReplyInput
            onSubmit={handleReply}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div
          className="
  ml-6
  pl-1
"
        >
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
