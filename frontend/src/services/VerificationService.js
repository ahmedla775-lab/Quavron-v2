import { supabase } from "../lib/supabase";

class VerificationService {

  async submit(values) {

    return await supabase
      .from("verification_requests")
      .insert(values);

  }

  async myRequest(userId) {

    return await supabase
      .from("verification_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending:false,
      })
      .limit(1)
      .maybeSingle();

  }

  async uploadDocument(userId,file){

    const extension =
      file.name.split(".").pop();

    const path =
      `documents/${userId}.${extension}`;

    const {error}=await supabase
      .storage
      .from("verification-documents")
      .upload(path,file,{
        upsert:true,
      });

    if(error) throw error;

    return path;

  }

}

export default new VerificationService();
