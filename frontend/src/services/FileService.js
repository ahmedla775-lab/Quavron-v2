import { supabase } from "../lib/supabase";

class FileService {

  async getFiles(projectId) {
    return await supabase
      .from("files")
      .select("*")
      .eq("project_id", projectId)
      .order("type", { ascending: false })
      .order("name", { ascending: true });
  }

  async createFile(values) {
    return await supabase
      .from("files")
      .insert(values)
      .select()
      .single();
  }

  async updateFile(id, values) {
    return await supabase
      .from("files")
      .update(values)
      .eq("id", id)
      .select()
      .single();
  }

  async renameFile(id, name) {
    return await supabase
      .from("files")
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
  }

  async moveFile(id, parentId) {
    return await supabase
      .from("files")
      .update({
        parent_id: parentId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
  }

  async deleteFile(id) {
    return await supabase
      .from("files")
      .delete()
      .eq("id", id);
  }

}

export default new FileService();
