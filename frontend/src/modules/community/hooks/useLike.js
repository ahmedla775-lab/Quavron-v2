import { useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import LikeService from "../services/LikeService";

export default function useLike() {

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function toggleLike(post) {

    if (!user) {
      alert("No user logged in");
      return false;
    }

    setLoading(true);

    try {

      const check = await LikeService.isLiked(
        post.id,
        user.id
      );

      if (check.error) {
        alert("CHECK ERROR:\n" + check.error.message);
        return false;
      }

      if (check.data) {

        const result = await LikeService.removeLike(
          post.id,
          user.id
        );

        if (result.error) {
          alert("REMOVE ERROR:\n" + result.error.message);
          return true;
        }

        return false;

      }

      const result = await LikeService.addLike(
        post.id,
        user.id
      );

      if (result.error) {
        alert("ADD ERROR:\n" + result.error.message);
        return false;
      }

      alert("LIKE SUCCESS");

      return true;

    } catch (err) {

      alert("EXCEPTION:\n" + err.message);

      return false;

    } finally {

      setLoading(false);

    }

  }

  return {
    toggleLike,
    loading,
  };

}
