import useSocialHub from "../../../modules/socialhub/hooks/useSocialHub";

import YouTubeRenderer from "../../../modules/socialhub/components/renderers/YouTubeRenderer";


export default function SocialActivityFeed({
  platform,
}) {

  const {
    feed,
    loading,
    error,
  } = useSocialHub();



  const filteredFeed =
    feed.filter(
      (item) =>
        item.source?.toLowerCase() ===
        platform.toLowerCase()
    );



  function renderContent(item) {

    if (platform === "YouTube") {

      return (
        <YouTubeRenderer
          item={item}
        />
      );

    }


    return (
      <div
        className="
          text-slate-400
        "
      >
        {platform} renderer is not ready yet
      </div>
    );

  }



  if (loading) {

    return (
      <div
        className="
          p-6
          text-slate-400
        "
      >
        Loading {platform}...
      </div>
    );

  }



  if (error) {

    return (
      <div
        className="
          p-6
          text-red-400
        "
      >
        Error loading Social Hub
      </div>
    );

  }



  if (!filteredFeed.length) {

    return (
      <div
        className="
          flex
          h-full
          items-center
          justify-center
          p-6
          text-slate-400
        "
      >
        No {platform} content
      </div>
    );

  }



  return (

    <div
      className="
        flex
        flex-col
        gap-6
        p-4
      "
    >

      {
        filteredFeed.map((item) => (

          <div
            key={item.id}
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-4
            "
          >

            {renderContent(item)}

          </div>

        ))
      }

    </div>

  );

}
