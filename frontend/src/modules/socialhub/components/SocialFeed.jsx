import { useState } from "react";

import useSocialHub from "../hooks/useSocialHub";

import SocialCard from "./SocialCard";
import ContentView from "./ContentView";

export default function SocialFeed() {
  const {
    feed,
    loading,
    error,
  } = useSocialHub();

  const [selected, setSelected] = useState(null);

  if (loading) {
    return (
      <div className="p-6 text-slate-400">
        Loading Social Hub...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load Social Hub.
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="p-6 text-slate-500">
        No content available.
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-12">

      <div className="col-span-4 overflow-y-auto border-r border-slate-800">

        {feed.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="
              cursor-pointer
              border-b
              border-slate-800
              hover:bg-slate-900
            "
          >
            <SocialCard item={item} />
          </div>
        ))}

      </div>

      <div className="col-span-8 h-full">

        <ContentView item={selected} />

      </div>

    </div>
  );
}
