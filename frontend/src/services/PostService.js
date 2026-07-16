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

  async getUserPosts(userId) {

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
      .eq("author_id", userId)
      .order("created_at", {
        ascending: false,
      });

  }

  async getSavedPosts(userId) {

    return await supabase
      .from("bookmarks")
      .select(`
        posts!inner (
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
        )
      `)
      .eq("user_id", userId);

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

  async getPost(id) {

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
