import { supabase } from "../lib/supabase";

class SupabaseIntegration {

  get client() {
    return supabase;
  }

  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async session() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  }

}

export default new SupabaseIntegration();

