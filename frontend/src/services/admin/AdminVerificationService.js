import { supabase } from "../../lib/supabase";

class AdminVerificationService {

  async getRequests() {
    return await supabase
      .from("verification_requests")
      .select(`
        *,
        profiles:user_id(
          id,
          username,
          full_name,
          avatar_url,
          verified,
          verification_type
        )
      `)
      .order("created_at", {
        ascending: false,
      });
  }

  async getRequest(id) {
    return await supabase
      .from("verification_requests")
      .select(`
        *,
        profiles:user_id(
          id,
          username,
          full_name,
          avatar_url,
          verified,
          verification_type
        )
      `)
      .eq("id", id)
      .single();
  }

  async approve(requestId, userId, type) {

    const { error } = await supabase
      .from("profiles")
      .update({
        verified: true,
        verification_type: type,
      })
      .eq("id", userId);

    if (error) return { error };

    return await supabase
      .from("verification_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

  }

  async reject(requestId) {

    return await supabase
      .from("verification_requests")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

  }

}

export default new AdminVerificationService();
