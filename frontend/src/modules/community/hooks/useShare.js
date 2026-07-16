import { useState } from "react";

import { useAuth } from "../../../components/auth/AuthProvider";

import ShareService from "../services/ShareService";

export default function useShare() {

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  async function share(post) {

    if (!user) return false;

    setLoading(true);

    try {

      const { data } = await ShareService.isShared(
        post.id,
        user.id
      );

      if (!data) {

        await ShareService.sharePost(
          post.id,
          user.id
        );

      }

      const postUrl =
        `${window.location.origin}/post/${post.id}`;

      if (navigator.share) {

        await navigator.share({
          title: "Quavron",
          text: post.content || "Check this post on Quavron",
          url: postUrl,
        });

      } else {

        await navigator.clipboard.writeText(postUrl);

        alert("تم نسخ رابط المنشور.");

      }

      return true;

    } catch (error) {

      console.error(error);

      return false;

    } finally {

      setLoading(false);

    }

  }

  return {
    share,
    loading,
  };

}
