import { supabase } from "../lib/supabase";

class ProfileService {

  async getProfile(id) {
    return await supabase
      .from("profiles")
    	  .select("*")
      .eq("id", id)
      .single();
  }

  async getProfileByUsername(username) {
    return await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();
  }

  async updateProfile(id, values) {
    return await supabase
      .from("profiles")
      .update(values)
      .eq("id", id)
      .select()
      .single();
  }

  async isUsernameAvailable(username, currentId) {

    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (!data) return true;

    return data.id === currentId;

  }

  async uploadAvatar(userId, file) {

    const extension = file.name.split(".").pop();

    const path = `avatars/${userId}.${extension}`;

    const { error } = await supabase.storage
      .from("post-media")
      .upload(path, file, {
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("post-media")
      .getPublicUrl(path);

    return data.publicUrl;

  }

  async uploadCover(userId, file) {

    const extension = file.name.split(".").pop();

    const path = `covers/${userId}.${extension}`;

    const { error } = await supabase.storage
      .from("post-media")
      .upload(path, file, {
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("post-media")
      .getPublicUrl(path);

    return data.publicUrl;

  }

  async getFollowers(userId) {

    return await supabase
      .from("followers")
      .select(`
        *,
        profiles:follower_id(
          id,
          username,
          full_name,
          avatar_url,
verified,
verification_type          
role
        )
      `)
      .eq("following_id", userId);

  }

  async getFollowing(userId) {

    return await supabase
      .from("followers")
      .select(`
        *,
        profiles:following_id(
          id,
          username,
          full_name,
          avatar_url,
verified,
verification_type
role
)          
      `)
      .eq("follower_id", userId);

  }

  async follow(followerId, followingId) {

    return await supabase
      .from("followers")
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

  }

  async unfollow(followerId, followingId) {

    return await supabase
      .from("followers")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

  }

}

export default new ProfileService();
