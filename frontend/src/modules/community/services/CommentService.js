import { supabase } from "../../../lib/supabase";


class CommentService {


  async getComments(postId) {

    return await supabase
      .from("comments")
      .select(`
        *,
        profiles!comments_author_id_fkey (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("post_id", postId)
      .order("created_at", {
        ascending: true,
      });

  }



  async createComment(values) {

    return await supabase
      .from("comments")
      .insert(values)
      .select(`
        *,
        profiles!comments_author_id_fkey (
          username,
          full_name,
          avatar_url
        )
      `)
      .single();

  }



  async deleteComment(id) {

    return await supabase
      .from("comments")
      .delete()
      .eq("id", id);

  }


}


export default new CommentService();
