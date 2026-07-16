import { useEffect, useState } from "react";

import { Play } from "lucide-react";

import { supabase } from "../../lib/supabase";

export default function ProfileMedia({

  profile,

}) {

  const [media, setMedia] = useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadMedia() {

    if (!profile) return;

    setLoading(true);

    try {

      const { data, error } =
        await supabase
          .from("post_media")
          .select(`
            *,
            posts!inner(
              id,
              author_id
            )
          `)
          .eq("posts.author_id", profile.id)
          .order("created_at", {
            ascending: false,
          });

      if (error) throw error;

      setMedia(data || []);

    } catch (error) {

      console.error(error);

      setMedia([]);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadMedia();

  }, [profile]);

  if (loading) {

    return (

      <div className="mt-8 text-center text-slate-400">

        Loading media...

      </div>

    );

  }

  if (media.length === 0) {

    return (

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

        <h2 className="text-2xl font-bold text-white">

          No media yet

        </h2>

        <p className="mt-3 text-slate-400">

          Images and videos from your posts will appear here.

        </p>

      </div>

    );

  }

  return (

    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

      {media.map((item) => (

        <div
          key={item.id}
          className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
        >

          {item.type === "image" ? (

            <img
              src={item.url}
              alt=""
              className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
            />

          ) : (

            <div className="relative">

              <video
                src={item.url}
                className="aspect-square w-full object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="rounded-full bg-black/60 p-4">

                  <Play
                    size={34}
                    className="text-white"
                  />

                </div>

              </div>

            </div>

          )}

        </div>

      ))}

    </div>

  );

}
