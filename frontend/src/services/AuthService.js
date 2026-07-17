import { supabase } from "../lib/supabase";

export async function login(email, password) {

  return await supabase.auth.signInWithPassword({

    email,

    password,

  });

}

export async function register(

  fullName,

  username,

  email,

  password

) {

  return await supabase.auth.signUp({

    email,

    password,

    options: {

      data: {

        full_name: fullName,

        username,

      },

    },

  });

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

export async function updatePassword(

  password

) {

  return await supabase.auth.updateUser({

    password,

  });

}

export async function updateEmail(

  email

) {

  return await supabase.auth.updateUser({

    email,

  });

}

export async function resetPassword(

  email

) {

  return await supabase.auth.resetPasswordForEmail(

    email,

    {

      redirectTo:

        window.location.origin +

        "/reset-password",

    }

  );

}

export function onAuthStateChange(

  callback

) {

  return supabase.auth.onAuthStateChange(

    callback

  );

}

const AuthService = {

  login,

  register,

  logout,

  getUser,

  getSession,

  updatePassword,

  updateEmail,

  resetPassword,

  onAuthStateChange,

};

export default AuthService;
