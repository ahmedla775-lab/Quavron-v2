import { useEffect, useState } from "react";

import PostCard from "../community/PostCard";
import PostService from "../../services/PostService";

export default function ProfileSaved({ profile }) {

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function load() {

      try {

        const { data, error } =
          await PostService.getSavedPosts(
            profile.id
          );

        if (error) throw error;

        setPosts(data || []);

      } catch (err) {

        console.error(err);
        setError(err.message);

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

  if (error) {

    return (
      <div className="mt-8 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-8 text-center text-[var(--q-muted)]">
        {error}
      </div>
    );

  }


  if (!posts.length) {

    return (
      <div className="mt-8 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-8 text-center text-[var(--q-muted)]">
        No saved posts.
      </div>
    );

  }

  return (

    <div className="mt-8 space-y-6">

      {posts.map((post) => (

        <PostCard
          key={post.id}
          post={post}
        />

      ))}

    </div>

  );

}
