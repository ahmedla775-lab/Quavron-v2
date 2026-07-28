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
         reaction_type: reaction,
})
        .eq("id", existing.data.id);
    }

    return await supabase
      .from("post_reactions")
      .insert({
  post_id: postId,
  user_id: userId,
  reaction_type: reaction,
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
    .select(`
      reaction_type,
      created_at,
      profiles (
        id,
        username,
        full_name,
        avatar_url
verified,
        verification_type
      )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
}
  async countByReaction(postId) {
    const { data, error } =
      await this.getPostReactions(postId);

    const counts = {
  LIKE: 0,
  LOVE: 0,
  SUPPORT: 0,
  AMAZING: 0,
  CELEBRATE: 0,
  BOOM: 0,
  PERFECT: 0,
  SAD: 0,
  ANGRY: 0,
  DISLIKE: 0,
};
    if (error || !data) {
      return counts;
    }

    data.forEach((item) => {
  if (counts[item.reaction_type] !== undefined) {
    counts[item.reaction_type]++;
  }
});
    return counts;
  }
}

export default new ReactionService();
