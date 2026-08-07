import { useEffect, useState } from "react";
import { ACCOUNT_TYPE_LABELS } from "../../../constants/accountTypes";
import { useAuth } from "../../auth/AuthProvider";
import { supabase } from "../../../lib/supabase";


export default function IdentitySettings(){

  const { user } = useAuth();

  const [type,setType] = useState("individual");
  const [saved,setSaved] = useState(false);
  const [loading,setLoading] = useState(false);


  useEffect(()=>{

    if(user){

      setType(
        user.user_metadata?.account_type || "individual"
      );

    }

  },[user]);


  async function saveIdentity(){

    if(!user) return;


    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({

        data:{
          account_type:type,
        },

      });


    setLoading(false);


    if(!error){

      setSaved(true);

      setTimeout(()=>{
        setSaved(false);
      },3000);

    }

  }


  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-[var(--q-text)]">
        Professional Identity
      </h1>


      <p className="mt-2 text-[var(--q-muted)]">
        Choose your role on Quavron platform.
      </p>


      <select
        value={type}
        onChange={(e)=>setType(e.target.value)}
        className="mt-8 rounded-xl border p-4 bg-[var(--q-surface)]"
      >

        {Object.entries(ACCOUNT_TYPE_LABELS)
          .map(([key,label])=>(

          <option key={key} value={key}>
            {label}
          </option>

        ))}

      </select>


      <div>

        <button
          onClick={saveIdentity}
          disabled={loading}
          className="mt-6 rounded-xl bg-cyan-500 px-8 py-3 font-bold text-white"
        >

          {loading ? "Saving..." : "Save Identity"}

        </button>


        {saved && (

          <p className="mt-4 text-green-500">
            Identity saved successfully.
          </p>

        )}

      </div>


    </div>

  );

}
