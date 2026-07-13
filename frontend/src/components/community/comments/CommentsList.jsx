import CommentItem from "./CommentItem";


export default function CommentsList({
  comments,
  onReply,
}) {


  const mainComments =
    comments.filter(
      (comment) =>
        !comment.parent_id
    );



  function getReplies(commentId) {

    return comments.filter(
      (comment) =>
        comment.parent_id === commentId
    );

  }



  if (mainComments.length === 0) {

    return (

      <div className="py-6 text-center text-slate-500">

        No comments yet

      </div>

    );

  }



  return (

    <div className="space-y-4">


      {mainComments.map((comment)=>(

        <div key={comment.id}>


          <CommentItem

            comment={comment}

            onReply={onReply}

          />



          <div className="ml-8 border-l border-slate-800 pl-4">


            {getReplies(comment.id)
              .map((reply)=>(


                <CommentItem

                  key={reply.id}

                  comment={reply}

                  onReply={onReply}

                />


              ))}


          </div>


        </div>

      ))}


    </div>

  );

}
