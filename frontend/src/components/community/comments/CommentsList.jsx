import CommentItem from "./CommentItem";

export default function CommentsList({
  comments = [],
  onReply,
}) {
  if (comments.length === 0) {
    return (
      <div
        className="
          py-10
          text-center
          text-[var(--q-muted)]
        "
      >
        No comments yet.
      </div>
    );
  }

  return (
    <div 
className="mt-1 space-y-2">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
