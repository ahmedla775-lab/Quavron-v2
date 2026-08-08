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

  async approve(requestId, type = "blue") {
    console.log("RPC approve_verification_request:", {
      p_request_id: requestId,
      p_type: type,
    });

    if (!requestId) {
      return {
        data: null,
        error: new Error("Missing verification request ID"),
      };
    }

    return await supabase.rpc(
      "approve_verification_request",
      {
        p_request_id: requestId,
        p_type: type,
      }
    );
  }
  async reject(requestId, reason = "") {
    return await supabase.rpc(
      "reject_verification_request",
      {
        p_request_id: requestId,
        p_reason: reason,
      }
    );
  }
}

export default new AdminVerificationService();
