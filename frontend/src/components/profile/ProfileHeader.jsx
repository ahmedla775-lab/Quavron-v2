import {
  ArrowLeft,
  Camera,
  Edit,
  Share2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function ProfileHeader({

  profile,

  onEdit,

}) {

  const navigate = useNavigate();

  return (

    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

      <div className="relative h-56 w-full bg-slate-800">

        <img
          src={
            profile?.cover_url ||
            "/quavron-logo.png"
          }
          alt=""
          className="h-full w-full object-cover"
        />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-xl bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80"
        >

          <ArrowLeft size={20} />

        </button>

        <button
          className="absolute right-16 top-4 rounded-xl bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80"
        >

          <Share2 size={20} />

        </button>

        <button
          onClick={onEdit}
          className="absolute right-4 top-4 rounded-xl bg-blue-600 p-2 text-white hover:bg-blue-700"
        >

          <Edit size={20} />

        </button>

      </div>

<div className="relative px-4 pb-6 md:px-8 md:pb-8">

  <div className="-mt-16 flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">    
          <div className="relative">

<img
  src={
    profile?.avatar_url ||
    "https://ui-avatars.com/api/?background=2563eb&color=fff&name=Q"
  }
  alt=""
  className="h-24 w-24 rounded-full border-4 border-slate-900 object-cover md:h-32 md:w-32"
/>    
            <button
              onClick={onEdit}
              className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-2 text-white"
            >

              <Camera size={16} />

            </button>

          </div>

<div className="flex-1 w-full">          

          <h1 className="text-2xl font-bold text-white md:text-3xl">
              {profile?.full_name}

            </h1>

            <p className="mt-1 text-slate-400">

              @{profile?.username}

            </p>

            <p className="mt-4 max-w-3xl text-slate-300">

              {profile?.bio}

            </p>
<div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">

  <button
    onClick={onEdit}
    className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
  >
    Edit Profile
  </button>

  <button className="rounded-xl border border-slate-700 px-5 py-2 text-slate-300 hover:bg-slate-800">
    Share Profile
  </button>

</div>

          </div>

        </div>

      </div>

    </div>

  );

}
