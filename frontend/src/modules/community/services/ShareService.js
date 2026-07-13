import { supabase } from "../../../lib/supabase";

class ShareService {

  async sharePost(postId, userId) {

    return await supabase
      .from("post_shares")
      .insert({
        post_id: postId,
        user_id: userId,
      });

  }

  async removeShare(postId, userId) {

    return await supabase
      .from("post_shares")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

  }

  async isShared(postId, userId) {

    return await supabase
      .from("post_shares")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

  }

  async countShares(postId) {

    return await supabase
      .from("post_shares")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("post_id", postId);

  }

}

export default new ShareService();
