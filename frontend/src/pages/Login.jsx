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

    } else {

      alert(
        "Login successful 🚀"
      );

    }

  };

  return (

    <div
      style={{
        background:"#111827",
        color:"white",
        minHeight:"100vh",
        padding:"40px",
        fontFamily:"Arial"
      }}
    >

      <h1>
        Login 🚀
      </h1>

      <div
        style={{
          display:"flex",
          flexDirection:"column",
          gap:"15px",
          marginTop:"30px",
          maxWidth:"300px"
        }}
      >

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
          style={{
            padding:"12px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
          style={{
            padding:"12px"
          }}
        />

        <button
          onClick={login}
          style={{
            padding:"12px",
            background:"#16a34a",
            color:"white",
            border:"none"
          }}
        >
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;0

