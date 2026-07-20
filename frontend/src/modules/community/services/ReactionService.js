import { supabase } from "../../../lib/supabase";

class ReactionService {

  async getUserReaction(postId, userId) {
    return await supabase
      .from("post_reactions")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();
  }

  async setReaction(postId, userId, reaction) {
    const existing =
      await this.getUserReaction(postId, userId);

    if (existing.data) {
      return await supabase
        .from("post_reactions")
        .update({
          reaction,
        })
        .eq("id", existing.data.id);
    }

    return await supabase
      .from("post_reactions")
      .insert({
        post_id: postId,
        user_id: userId,
        reaction,
      });
  }

  async removeReaction(postId, userId) {
    return await supabase
      .from("post_reactions")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
  }

  async getPostReactions(postId) {
    return await supabase
      .from("post_reactions")
      .select("reaction")
      .eq("post_id", postId);
  }

  async countByReaction(postId) {
    const { data, error } =
      await this.getPostReactions(postId);

    const counts = {
      LIKE: 0,
      HAHA: 0,
      FIRE: 0,
      WOW: 0,
      SAD: 0,
      SUPPORT: 0,
    };

    if (error || !data) {
      return counts;
    }

    data.forEach((item) => {
      if (counts[item.reaction] !== undefined) {
        counts[item.reaction]++;
      }
    });

    return counts;
  }
}

export default new ReactionService();
