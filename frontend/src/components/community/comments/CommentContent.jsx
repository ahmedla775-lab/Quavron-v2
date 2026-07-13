export default function CommentContent({

  comment,

}) {

  return (

    <div className="mb-3">

      <p className="whitespace-pre-wrap text-slate-200 leading-7">

        {comment.content}

      </p>

      <p className="mt-2 text-xs text-slate-500">

        {new Date(comment.created_at)
          .toLocaleString()}

      </p>

    </div>

  );

}
