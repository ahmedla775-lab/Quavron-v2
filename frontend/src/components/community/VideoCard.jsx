import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Play,
} from "lucide-react";


export default function VideoCard({
  platform,
  title,
  author,
  content = "",
  mediaUrl = "",
  likes = 0,
  comments = 0,
  views = 0,
}) {

  return (

    <div
      className="
        w-full
        overflow-hidden
        border-b
        border-slate-800
        bg-slate-900

        sm:rounded-2xl
        sm:border
        sm:shadow-lg
      "
    >


      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-800
          p-3

          sm:p-4
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-blue-600
              text-lg
              font-bold
              text-white
            "
          >
            {author.charAt(0).toUpperCase()}
          </div>


          <div>

            <h3 className="font-semibold text-white">
              {author}
            </h3>

            <p className="text-sm text-slate-400">
              {platform}
            </p>

          </div>

        </div>


        <span
          className="
            rounded-lg
            bg-slate-800
            px-3
            py-1
            text-xs
            text-slate-300
          "
        >
          Now
        </span>


      </div>





      {/* Media */}

      <div
        className="
          relative
          flex
          aspect-video
          w-full
          items-center
          justify-center
          bg-slate-800
        "
      >

        {mediaUrl ? (

          <img
            src={mediaUrl}
            alt={title}
            className="
              h-full
              w-full
              object-cover
            "
          />

        ) : (

          <Play
            size={60}
            className="text-white"
          />

        )}

      </div>





      {/* Content */}

      <div
        className="
          space-y-3
          p-4
        "
      >

        <h2
          className="
            text-lg
            font-bold
            text-white
          "
        >
          {title}
        </h2>


        {content && (

          <p className="text-slate-300">
            {content}
          </p>

        )}




        <div
          className="
            flex
            items-center
            gap-5
            text-sm
            text-slate-400
          "
        >

          <div className="flex items-center gap-1">
            <Eye size={18}/>
            {views}
          </div>


          <div className="flex items-center gap-1">
            <Heart size={18}/>
            {likes}
          </div>


          <div className="flex items-center gap-1">
            <MessageCircle size={18}/>
            {comments}
          </div>


        </div>





        <div
          className="
            flex
            justify-between
            border-t
            border-slate-800
            pt-4
          "
        >

          <button className="text-slate-300 hover:text-red-500">
            <Heart size={20}/>
          </button>


          <button className="text-slate-300 hover:text-blue-400">
            <MessageCircle size={20}/>
          </button>


          <button className="text-slate-300 hover:text-green-400">
            <Share2 size={20}/>
          </button>


          <button className="text-slate-300 hover:text-yellow-400">
            <Bookmark size={20}/>
          </button>


        </div>


      </div>


    </div>

  );

}
