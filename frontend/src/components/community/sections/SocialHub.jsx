import SocialFeed from "../../../modules/socialhub/components/SocialFeed";

export default function SocialHub() {
  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold text-white">
          Social Hub
        </h1>

        <p className="mt-2 text-slate-400">
          Discover videos, posts and news from supported platforms.
        </p>
      </div>

      <SocialFeed />
    </div>
  );
}
