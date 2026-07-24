import { supabase } from "../../lib/supabase";

class VerificationStorageService {

  async upload(userId, file) {

    const extension = file.name.split(".").pop();

    const path =
      `${userId}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("verification-documents")
      .upload(path, file, {
        upsert: true,
      });

    if (error) throw error;

    return path;

  }

}

export default new VerificationStorageService();
