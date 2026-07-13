import { useState } from "react";

import { useAuth } from "../../../components/auth/AuthProvider";

import BookmarkService from "../services/BookmarkService";

export default function useBookmark() {

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(false);

  async function toggleBookmark(post) {

    if (!user) return false;

    setLoading(true);

    try {

      const { data } =
        await BookmarkService.isBookmarked(
          post.id,
          user.id
        );

      if (data) {

        await BookmarkService.removeBookmark(
          post.id,
          user.id
        );

        return false;

      }

      await BookmarkService.savePost(
        post.id,
        user.id
      );

      return true;

    } finally {

      setLoading(false);

    }

  }

  return {

    toggleBookmark,

    loading,

  };

}
