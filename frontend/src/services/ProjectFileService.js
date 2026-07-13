import { supabase } from "../lib/supabase";

class ProjectFileService {

  async getFiles(projectId) {
    return await supabase
      .from("files")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order");
  }

  async createFile(projectId, parentId, name, type) {
    return await supabase
      .from("files")
      .insert({
        project_id: projectId,
        parent_id: parentId,
        name,
        type,
      })
      .select()
      .single();
  }

  async saveFile(id, content) {
    return await supabase
      .from("files")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  async renameFile(id, name) {
    return await supabase
      .from("files")
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  async deleteFile(id) {
    return await supabase
      .from("files")
      .delete()
      .eq("id", id);
  }

}

export default new ProjectFileService();
