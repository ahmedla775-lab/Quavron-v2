const supabase = require("../../../lib/supabase");

class FollowService {

  async follow(followerId, followingId) {

    if (followerId === followingId) {
      throw new Error("You cannot follow yourself.");
    }

    const { data: exists } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .maybeSingle();

    if (exists) {
      return {
        success: true,
        alreadyFollowing: true,
      };
    }

    const { error } = await supabase
      .from("followers")
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

    if (error) throw error;

    return {
      success: true,
      following: true,
    };
  }

  async unfollow(followerId, followingId) {

    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (error) throw error;

    return {
      success: true,
      following: false,
    };
  }

  async isFollowing(followerId, followingId) {

  const { data, error } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  console.log("========== FOLLOW DEBUG ==========");
  console.log("Follower:", followerId);
  console.log("Following:", followingId);
  console.log("Data:", data);
  console.log("Error:", error);
  console.log("==================================");

  return data.length > 0;
}
  
  async getFollowers(userId) {

    const { data, error } = await supabase
      .from("followers")
      .select(`
        created_at,
        profiles!followers_follower_id_fkey(
          id,
          username,
          full_name,
          avatar_url,
          verified
        )
      `)
      .eq("following_id", userId);

    if (error) throw error;

    return data;
  }

  async getFollowing(userId) {

    const { data, error } = await supabase
      .from("followers")
      .select(`
        created_at,
        profiles!followers_following_id_fkey(
          id,
          username,
          full_name,
          avatar_url,
          verified
        )
      `)
      .eq("follower_id", userId);

    if (error) throw error;

    return data;
  }

}

module.exports = new FollowService();
