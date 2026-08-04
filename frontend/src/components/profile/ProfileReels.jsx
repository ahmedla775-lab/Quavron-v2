
import { useEffect, useState } from "react";
import PostService from "../../services/PostService";

export default function ProfileReels({ profile }) {

  const [reels, setReels] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function load() {

      try {

        const { data } =
          await PostService.getUserPosts(profile.id);


        const items = (data || [])
          .filter(
            (post) => post.type === "reel"
          );


        setReels(items);


      } catch (error) {

        console.error(error);

        setReels([]);

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


  if (!reels.length) {

    return (
      <div className="mt-8 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-8 text-center text-[var(--q-muted)]">
        No reels yet.
      </div>
    );

  }


  return (

    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

      {reels.map((reel) => (

        <div
          key={reel.id}
          className="aspect-[9/16] overflow-hidden rounded-2xl bg-black"
        >

          {reel.post_media?.[0]?.url && (

            <video
              src={reel.post_media[0].url}
              controls
              className="h-full w-full object-cover"
            />

          )}

        </div>

      ))}

    </div>

  );

}
