import { supabase } from "../lib/supabase";

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function register(fullName, email, password) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return { error };

  if (data.user) {
    await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name: fullName,
      });
  }

  return { data };

}

export async function logout() {
  return await supabase.auth.signOut();
}

export async function getUser() {
  return await supabase.auth.getUser();
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

const AuthService = {
  login,
  register,
  logout,
  getUser,
  getSession,
  onAuthStateChange,
};

export default AuthService;
