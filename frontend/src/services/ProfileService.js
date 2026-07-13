import { supabase } from "../lib/supabase";

class ProfileService {

  async getProfile(id) {
    return await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
  }

  async createProfile(values) {
    return await supabase
      .from("profiles")
      .insert(values)
      .select()
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

  async getFollowers(id) {
    return await supabase
      .from("follows")
      .select("*")
      .eq("following_id", id);
  }

  async getFollowing(id) {
    return await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", id);
  }

  async follow(followerId, followingId) {
    return await supabase
      .from("follows")
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });
  }

  async unfollow(followerId, followingId) {
    return await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);
  }

}

export default new ProfileService();
