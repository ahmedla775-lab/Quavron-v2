import { supabase } from "../lib/supabase";

class SettingsService {

  async get(userId) {

    return await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

  }

  async create(userId) {

    return await supabase
      .from("user_settings")
      .insert({

        user_id: userId,

        settings: {},

      })
      .select()
      .single();

  }

  async save(userId, settings) {

    return await supabase
      .from("user_settings")
      .upsert({

        user_id: userId,

        settings,

      })
      .select()
      .single();

  }

  async reset(userId) {

    return await supabase
      .from("user_settings")
      .update({

        settings: {},

      })
      .eq("user_id", userId);

  }

}

export default new SettingsService();
