const supabase = require("../../../lib/supabase");

class UserService {

  async getProfile(id) {

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async getByUsername(username) {

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;

    return data;
  }

}

module.exports = new UserService();
