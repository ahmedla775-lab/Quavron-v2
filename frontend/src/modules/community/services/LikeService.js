import { supabase } from "../../../lib/supabase";

class LikeService {

  async isLiked(postId, userId) {

    return await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

  }

  async addLike(postId, userId) {

    return await supabase
      .from("post_likes")
      .insert({
        post_id: postId,
        user_id: userId,
      });

  }

  async removeLike(postId, userId) {

    return await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

  }

  async countLikes(postId) {

    return await supabase
      .from("post_likes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("post_id", postId);

  }

}

export default new LikeService();
