import { supabase } from "../lib/supabase";

class SocialService {

  async getPosts() {
    return await supabase
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false });
  }

  async createPost(values) {
    return await supabase
      .from("social_posts")
      .insert(values)
      .select()
      .single();
  }

  async likePost(id, likes) {
    return await supabase
      .from("social_posts")
      .update({
        likes,
      })
      .eq("id", id);
  }

}

export default new SocialService();
