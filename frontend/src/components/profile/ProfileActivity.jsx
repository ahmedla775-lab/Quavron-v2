
import { useEffect, useState } from "react";
import PostService from "../../services/PostService";

export default function ProfileActivity({ profile }) {

  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function load() {

      try {

        const { data } =
          await PostService.getUserPosts(profile.id);


        setActivity(
          (data || []).slice(0, 10)
        );


      } catch (error) {

        console.error(error);

        setActivity([]);

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
        Loading activity...
      </div>
    );

  }


  if (!activity.length) {

    return (
      <div className="mt-8 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-8 text-center text-[var(--q-muted)]">
        No activity yet.
      </div>
    );

  }


  return (

    <div className="mt-8 space-y-4">

      {activity.map((item) => (

        <div
          key={item.id}
          className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-5"
        >

          <div className="flex items-center justify-between">

            <span className="font-semibold text-[var(--q-text)]">
              {item.type || "post"}
            </span>


            <span className="text-sm text-[var(--q-muted)]">
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : ""}
            </span>

          </div>


          <p className="mt-3 text-[var(--q-muted)]">
            {item.content || "Media activity"}
          </p>


        </div>

      ))}

    </div>

  );

}
