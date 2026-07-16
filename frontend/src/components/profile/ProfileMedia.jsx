import { useEffect, useState } from "react";

import PostService from "../../services/PostService";

export default function ProfileMedia({ profile }) {

  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      const { data } =
        await PostService.getUserPosts(
          profile.id
        );

      const files = [];

      (data || []).forEach((post) => {

        (post.post_media || []).forEach((file) => {

          files.push(file);

        });

      });

      setMedia(files);

      setLoading(false);

    }

    if (profile?.id) {

      load();

    }

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

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">

        No media found.

      </div>

    );

  }

  return (

    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

      {media.map((file) => (

        <div
          key={file.id}
          className="overflow-hidden rounded-xl bg-slate-900"
        >

          {file.type === "image" ? (

            <img
              src={file.url}
              alt=""
              className="h-48 w-full object-cover"
            />

          ) : (

            <video
              src={file.url}
              controls
              className="h-48 w-full object-cover"
            />

          )}

        </div>

      ))}

    </div>

  );

}
