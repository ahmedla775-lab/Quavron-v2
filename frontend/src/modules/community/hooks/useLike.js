import { useState } from "react";

import { useAuth } from "../../../components/auth/AuthProvider";

import LikeService from "../services/LikeService";

export default function useLike() {

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(false);

  async function toggleLike(post) {

    if (!user) return false;

    setLoading(true);

    try {

      const { data } =
        await LikeService.isLiked(
          post.id,
          user.id
        );

      if (data) {

        await LikeService.removeLike(
          post.id,
          user.id
        );

        return false;

      }

      await LikeService.addLike(
        post.id,
        user.id
      );

      return true;

    } finally {

      setLoading(false);

    }

  }

  return {

    toggleLike,

    loading,

  };

}
