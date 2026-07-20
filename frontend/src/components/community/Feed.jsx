import { useEffect, useState } from "react";

import { usePosts } from "../../context/PostContext";

import PlatformTabs from "./PlatformTabs";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

import SocialActivityFeed from "./activity/SocialActivityFeed";

import useResponsive from "../../hooks/useResponsive";


export default function Feed() {

  const [platform, setPlatform] = useState("All");

  const { isMobile } = useResponsive();

  const {
    posts,
    loading,
    loadPosts,
  } = usePosts();


  useEffect(() => {
    loadPosts();
  }, []);



  const isQuavronFeed =
    platform === "All";



  return (

    <div
      className="
        flex
        h-full
        min-w-0
        flex-col
        overflow-y-auto
        bg-slate-950
      "
    >


      <PlatformTabs
        selected={platform}
        onSelect={setPlatform}
      />



      {isQuavronFeed ? (

        <>

          <CreatePost />


          <p
            className="
              px-4
              py-2
              text-sm
              text-slate-400
            "
          >
            {
              loading
              ? "Loading posts..."
              : `${posts.length} Posts`
            }
          </p>



          <div
            className={`
              flex
              flex-col

              ${
                isMobile
                ? "space-y-2 px-0"
                : "space-y-4 p-4"
              }

            `}
          >

            {
              posts.map((post) => (

                <PostCard
                  key={post.id}
                  post={post}
                />

              ))
            }

          </div>

        </>

      ) : (

        <SocialActivityFeed
          platform={platform}
        />

      )}


    </div>

  );

}
