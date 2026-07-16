import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PostCard from "../components/community/PostCard";
import PostService from "../services/PostService";

export default function PostDetails() {

  const { id } = useParams();

  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      const { data } =
        await PostService.getPost(id);

      setPost(data);

      setLoading(false);

    }

    load();

  }, [id]);

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;

  if (!post)
    return <div className="p-10 text-center">Post not found</div>;

  return (
    <div className="mx-auto max-w-3xl py-10">
      <PostCard post={post} />
    </div>
  );

}
