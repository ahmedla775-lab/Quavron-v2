import { supabase } from "../../../lib/supabase.js";

class CompanyRepository {

  async getFeed(limit = 20) {

    return await supabase
      .from("company_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

  }

  async getById(id) {

    return await supabase
      .from("company_posts")
      .select("*")
      .eq("id", id)
      .single();

  }

  async create(values) {

    return await supabase
      .from("company_posts")
      .insert(values)
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

export default new CompanyRepository();
