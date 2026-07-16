import { useEffect, useState } from "react";

import PostCard from "../community/PostCard";

import PostService from "../../services/PostService";

export default function ProfilePosts({ profile }) {

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      const { data } =
        await PostService.getUserPosts(
          profile.id
        );

      setPosts(data || []);

      setLoading(false);

    }

    if (profile?.id) {

      load();

    }

  }, [profile]);

  if (loading) {

    return (

      <div className="mt-8 text-center text-slate-400">

        Loading posts...

      </div>

    );

  }

  if (posts.length === 0) {

    return (

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">

        No posts yet.

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
