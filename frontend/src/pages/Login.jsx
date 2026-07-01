import { useState } from "react";

import { supabase }
from "../lib/supabase";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {

    const { error } =
      await supabase.auth.signInWithPassword({

        email,
        password

      });

    if (error) {

      alert(error.message);

    }

    else {

      alert("Login Success 🚀");

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={login}>
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;
