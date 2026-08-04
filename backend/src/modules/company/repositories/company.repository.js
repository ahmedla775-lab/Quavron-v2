const supabase = require("../../../lib/supabase");
class CompanyRepository {
  async getFeed() {
    return await supabase
      .from("company_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", {
        ascending: false,
      });
  }

  async create(post) {
    return await supabase
      .from("company_posts")
      .insert(post)
      .select()
      .single();
  }

  async update(id, values) {
    return await supabase
      .from("company_posts")
      .update(values)
      .eq("id", id)
      .select()
      .single();
  }

  async remove(id) {
    return await supabase
      .from("company_posts")
      .delete()
      .eq("id", id);
  }
}

module.exports = new CompanyRepository();
