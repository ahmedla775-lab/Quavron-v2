import { supabase } from "../lib/supabase";

class PostService {

  async getPosts() {

    return await supabase
      .from("posts")
      .select(`
        *,
        profiles!posts_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          verified,
          verification_type
        ),
        post_media (
          id,
          type,
          mime_type,
          file_name,
          file_size,
          url,
          position,
          created_at
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  }

  async getUserPosts(userId) {

    return await supabase
      .from("posts")
      .select(`
        *,
        profiles!posts_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          verified,
          verification_type
        ),
        post_media (
          id,
          type,
          mime_type,
          file_name,
          file_size,
          url,
          position,
          created_at
        )
      `)
      .eq("author_id", userId)
      .order("created_at", {
        ascending: false,
      });

  }

  async getSavedPosts(userId) {

    const { data: bookmarks, error } = await supabase
      .from("post_bookmarks")
      .select("post_id")
      .eq("user_id", userId);

    if (error) {
      return {
        data: [],
        error,
      };
    }

    if (!bookmarks?.length) {
      return {
        data: [],
      };
    }

    const ids = bookmarks.map(
      (b) => b.post_id
    );

    return await supabase
      .from("posts")
      .select(`
        *,
        profiles!posts_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          verified,
          verification_type
        ),
        post_media (
          id,
          type,
          mime_type,
          file_name,
          file_size,
          url,
          position,
          created_at
        )
      `)
      .in("id", ids)
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

    if (error) {
      return {
        error,
      };
    }

    return await this.getPost(
      inserted.id
    );

  }

  async getPost(id) {

    return await supabase
      .from("posts")
      .select(`
        *,
        profiles!posts_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          verified,
          verification_type
        ),
        post_media (
          id,
          type,
          mime_type,
          file_name,
          file_size,
          url,
          position,
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

    if (error) {
      return {
        error,
      };
    }

    return await this.getPost(
      id
    );

  }

  async deletePost(id) {

    return await supabase
      .from("posts")
      .delete()
      .eq("id", id);

  }

}

export default new PostService();
