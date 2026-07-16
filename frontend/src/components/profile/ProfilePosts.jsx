import { useEffect, useState } from "react";

import PostCard from "../community/PostCard";

import PostService from "../../services/PostService";

export default function ProfilePosts({

  profile,

}) {

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadPosts() {

    if (!profile) return;

    setLoading(true);

    try {

      const { data, error } =
        await PostService.getUserPosts(
          profile.id
        );

      if (error) throw error;

      setPosts(data || []);

    } catch (error) {

      console.error(error);

      setPosts([]);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadPosts();

  }, [profile]);

  if (loading) {

    return (

      <div className="mt-8 flex justify-center">

        <div className="text-slate-400">

          Loading posts...

        </div>

      </div>

    );

  }

  if (posts.length === 0) {

    return (

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

        <h2 className="text-2xl font-bold text-white">

          No posts yet

        </h2>

        <p className="mt-3 text-slate-400">

          Your published posts will appear here.

        </p>

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
