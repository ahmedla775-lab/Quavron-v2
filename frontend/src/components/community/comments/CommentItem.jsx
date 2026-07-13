import { useState } from "react";

import CommentHeader from "./CommentHeader";
import CommentContent from "./CommentContent";
import CommentActions from "./CommentActions";
import ReplyInput from "./ReplyInput";


export default function CommentItem({
  comment,
  onReply,
}) {


  const [replying, setReplying] =
    useState(false);



  return (

    <div className="border-b border-slate-800 py-4">


      <CommentHeader

        profile={comment.profiles || {}}

        createdAt={comment.created_at}

      />


      <CommentContent

        content={comment.content}

      />


      <CommentActions

        comment={comment}

      />


      <button

        onClick={() =>
          setReplying(true)
        }

        className="mt-2 text-sm text-sky-500"

      >

        Reply

      </button>



      {replying && (

        <ReplyInput

          onCancel={() =>
            setReplying(false)
          }

          onSubmit={async(content)=>{

            await onReply(
              comment,
              content
            );

            setReplying(false);

          }}

        />

      )}


    </div>

  );

}
