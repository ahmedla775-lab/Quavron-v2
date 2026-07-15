import { supabase } from "../lib/supabase";

class PostService {

  async getPosts() {

    return await supabase
      .from("community_feed")
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        ),
        post_media (
          id,
          type,
          mime_type,
          file_name,
          file_size,
          url,
          created_at
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  }

  async createPost(values) {

    const { data: inserted, error } = await supabase
      .from("posts")
      .insert(values)
      .select("id")
      .single();

    if (error) return { error };

    return await supabase
      .from("community_feed")
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        ),
        post_media (
          id,
          type,
          mime_type,
          file_name,
          file_size,
          url,
          created_at
        )
      `)
      .eq("id", inserted.id)
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
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        ),
        post_media (
          id,
          type,
          mime_type,
          file_name,
          file_size,
          url,
          created_at
        )
      `)
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
