import { supabase } from "../lib/supabase";

class ProjectService {

  async getProjects(userId) {
    return await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
  }

async createProject(userId, name, description = "") {

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name,
      description,
    })
    .select()
    .single();

  if (error) return { data, error };

  await supabase
    .from("files")
    .insert([
      {
        project_id: data.id,
        name: "src",
        type: "folder",
      },
      {
        project_id: data.id,
        name: "public",
        type: "folder",
      },
      {
        project_id: data.id,
        name: "README.md",
        type: "file",
        extension: "md",
        content: "# " + name,
      },
      {
        project_id: data.id,
        name: "package.json",
        type: "file",
        extension: "json",
        content: "{}",
      },
    ]);

  return { data };
}
  async updateProject(id, values) {
    return await supabase
      .from("projects")
      .update(values)
      .eq("id", id);
  }

  async deleteProject(id) {
    return await supabase
      .from("projects")
      .delete()
      .eq("id", id);
  }

}

export default new ProjectService();
