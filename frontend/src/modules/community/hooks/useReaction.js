import { useEffect, useState } from "react";
import ReactionService from "../services/ReactionService";
import { useAuth } from "../../../components/auth/AuthProvider";

export default function useReaction(postId) {
  const { user } = useAuth();

  const [reaction, setReaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReaction() {
      if (!user || !postId) {
        setLoading(false);
        return;
      }

      const { data } = await ReactionService.getUserReaction(
        postId,
        user.id
      );

      if (data) {
        setReaction(data.reaction);
      }

      setLoading(false);
    }

    loadReaction();
  }, [postId, user]);

  async function toggleReaction(post, type) {
    if (!user) return;

    if (reaction === type) {
      await ReactionService.removeReaction(post.id, user.id);
      setReaction(null);
      return null;
    }

    await ReactionService.setReaction(
      post.id,
      user.id,
      type
    );

    setReaction(type);

    return type;
  }

  return {
    reaction,
    loading,
    toggleReaction,
  };
}
