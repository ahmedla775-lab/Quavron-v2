import { supabase } from "../../../lib/supabase";

class BookmarkService {

  async savePost(postId, userId) {

    return await supabase
      .from("post_bookmarks")
      .insert({
        post_id: postId,
        user_id: userId,
      });

  }

  async removeBookmark(postId, userId) {

    return await supabase
      .from("post_bookmarks")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

  }

  async isBookmarked(postId, userId) {

    return await supabase
      .from("post_bookmarks")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

  }

  async getBookmarks(userId) {
  return await supabase
    .from("post_bookmarks")
    .select(`
      post:posts(
        *,
        profiles(*)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });
}
}

export default new BookmarkService();
