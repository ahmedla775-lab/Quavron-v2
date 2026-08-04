
import { useEffect, useState } from "react";
import { Image, Video } from "lucide-react";

import PostService from "../../services/PostService";

export default function ProfileMedia({ profile }) {

  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function load() {

      try {

        const { data } =
          await PostService.getUserPosts(profile.id);

        const items =
          (data || []).flatMap((post) =>
            post.post_media || []
          );

        setMedia(items);

      } catch (error) {

        console.error(error);

        setMedia([]);

      } finally {

        setLoading(false);

      }

    }

    if (profile?.id) {
      load();
    }

  }, [profile]);


  if (loading) {

    return (
      <div className="mt-8 text-center text-[var(--q-muted)]">
        Loading...
      </div>
    );

  }


  return (

    <div className="mt-8 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-8">

      <div className="mb-6 flex items-center gap-3">

        <Image
          size={22}
          className="text-blue-500"
        />

        <h2 className="text-2xl font-bold text-[var(--q-text)]">
          Media
        </h2>

      </div>


      {!media.length ? (

        <div className="text-center text-[var(--q-muted)]">
          No media yet.
        </div>

      ) : (

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

          {media.map((item, index) => (

            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--q-card)]"
            >

              {item.mime_type?.startsWith("video/") ? (

                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                />

              ) : (

                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                />

              )}


              {item.mime_type?.startsWith("video/") && (

                <div className="absolute right-3 top-3 rounded-full bg-black/50 p-2">

                  <Video
                    size={16}
                    className="text-white"
                  />

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

}
