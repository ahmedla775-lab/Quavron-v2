import { supabase } from "../lib/supabase";

export async function signUp({
  name,
  email,
  password,
}) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });
}

export async function signIn({
  email,
  password,
}) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function resetPassword(email) {
  return await supabase.auth.resetPasswordForEmail(email);
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function getUser() {
  return await supabase.auth.getUser();
}

export async function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

