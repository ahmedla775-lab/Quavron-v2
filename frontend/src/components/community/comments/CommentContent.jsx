export default function CommentContent({

  content,

}) {

  return (

    <div className="mb-3">

      <p className="whitespace-pre-wrap leading-7 text-slate-200">

        {content}

      </p>

    </div>

  );

}
