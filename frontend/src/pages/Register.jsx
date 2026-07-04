import { useState } from "react";

import { supabase }
from "../lib/supabase";

function Register() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const register = async () => {

    const { error } =
      await supabase.auth.signUp({

        email,
        password

      });

    if (error) {

      alert(error.message);

    } else {

      alert(
        "Account created successfully 🚀"
      );

    }

  };

  return (

    <div
      style={{
        background:"#0f172a",
        color:"white",
        minHeight:"100vh",
        padding:"40px",
        fontFamily:"Arial"
      }}
    >

      <h1>
        Register 🚀
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
          onClick={register}
          style={{
            padding:"12px",
            background:"#2563eb",
            color:"white",
            border:"none"
          }}
        >
          Create Account
        </button>

      </div>

    </div>

  );

}

export default Register;0

