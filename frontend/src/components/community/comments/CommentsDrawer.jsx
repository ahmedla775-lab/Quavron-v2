import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";


export default function CommentsDrawer({

  open,

  comments,

  onClose,

  onSubmit,

  onReply,

}) {


  if (!open) return null;



  return (

    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">


      <div className="h-full w-full max-w-md overflow-y-auto bg-slate-950 p-5">


        <div className="mb-5 flex items-center justify-between">


          <h2 className="text-xl font-bold text-white">

            Comments

          </h2>


          <button

            onClick={onClose}

            className="text-slate-400 hover:text-white"

          >

            ✕


          </button>


        </div>



        <CreateComment

          onSubmit={(content)=>
            onSubmit(content)
          }

        />



        <CommentsList

          comments={comments}

          onReply={onReply}

        />


      </div>


    </div>

  );

}
