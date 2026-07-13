import PostHeader from "./post/PostHeader";
import PostContent from "./post/PostContent";
import PostActions from "./post/PostActions";

export default function PostCard({ post }) {

  return (

    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-slate-700">

      <PostHeader post={post} />

      <PostContent post={post} />

      <PostActions post={post} />

    </article>

  );

}
