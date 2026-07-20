import { supabase } from "../../../lib/supabase";


class LikeService {


  async getReaction(postId,userId){

    return await supabase
      .from("post_reactions")
      .select("*")
      .eq("post_id",postId)
      .eq("user_id",userId)
      .maybeSingle();

  }



  async setReaction(postId,userId,reaction){

    const existing =
      await this.getReaction(postId,userId);


    if(existing.data){

      return await supabase
        .from("post_reactions")
        .update({
          reaction
        })
        .eq(
          "id",
          existing.data.id
        );

    }


    return await supabase
      .from("post_reactions")
      .insert({

        post_id:postId,
        user_id:userId,
        reaction

      });

  }



  async removeReaction(postId,userId){

    return await supabase
      .from("post_reactions")
      .delete()
      .eq(
        "post_id",
        postId
      )
      .eq(
        "user_id",
        userId
      );

  }



  async countReactions(postId){

    return await supabase
      .from("post_reactions")
      .select(
        "reaction"
      )
      .eq(
        "post_id",
        postId
      );

  }


}


export default new LikeService();
