import { supabase } from "../lib/supabase";

class PostService {

  async getPosts() {

    return await supabase
      .from("community_feed")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  }

  async createPost(values) {

    const { error } = await supabase
      .from("posts")
      .insert(values);

    if (error) return { error };

    return await supabase
      .from("community_feed")
      .select("*")
      .eq("id", values.id)
      .single();

  }

  async updatePost(id, values) {

    const { error } = await supabase
      .from("posts")
      .update(values)
      .eq("id", id);

    if (error) return { error };

    return await supabase
      .from("community_feed")
      .select("*")
      .eq("id", id)
      .single();

  }

  async deletePost(id) {

    return await supabase
      .from("posts")
      .delete()
      .eq("id", id);

  }

}

export default new PostService();
