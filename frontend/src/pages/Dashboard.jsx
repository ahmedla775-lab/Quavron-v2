import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Dashboard() {

  const [projects, setProjects] = useState([]);
  const [socials, setSocials] = useState([]);
  const [name, setName] = useState("");

  const loadProjects = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id);

    setProjects(data || []);

  };

  const loadSocials = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("social_accounts")
      .select("*")
      .eq("user_id", user.id);

    setSocials(data || []);

  };

  const createProject = async () => {

    if (!name) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("projects")
      .insert([
        {
          name,
          user_id: user.id
        }
      ]);

    setName("");

    loadProjects();

  };

  const connectSocial = async (platform) => {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("social_accounts")
      .insert([
        {
          user_id: user.id,
          platform
        }
      ]);

    loadSocials();

  };

  useEffect(() => {

    loadProjects();
    loadSocials();

  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px"
        }}
      >

        <div>

          <h1
            style={{
              color: "white",
              fontSize: "34px"
            }}
          >
            Workspace 🚀
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Welcome back to Quavron
          </p>

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >

          <button
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#111827",
              color: "white"
            }}
          >
            🔔
          </button>

          <button
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "white"
            }}
          >
            AI ✨
          </button>

        </div>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}
      >

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "14px"
          }}
        >
          <p style={{ color: "#94a3b8" }}>
            Projects
          </p>

          <h2 style={{ color: "white" }}>
            {projects.length}
          </h2>
        </div>

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "14px"
          }}
        >
          <p style={{ color: "#94a3b8" }}>
            Accounts
          </p>

          <h2 style={{ color: "white" }}>
            {socials.length}
          </h2>
        </div>

      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "40px"
        }}
      >

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Project name"
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border: "none"
          }}
        />

        <button
          onClick={createProject}
          style={{
            padding: "14px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "white"
          }}
        >
          Create
        </button>

      </div>

      <h2
        style={{
          color: "white",
          marginBottom: "20px"
        }}
      >
        Projects 🚀
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "50px"
        }}
      >

        {projects.map((project) => (

          <div
            key={project.id}
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "14px"
            }}
          >

            <h3 style={{ color: "white" }}>
              {project.name}
            </h3>

          </div>

        ))}

      </div>

      <h2
        style={{
          color: "white",
          marginBottom: "20px"
        }}
      >
        Social Hub 🔥
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px"
        }}
      >

        {[
          "Facebook",
          "Instagram",
          "TikTok",
          "YouTube"
        ].map((platform) => (

          <div
            key={platform}
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "14px"
            }}
          >

            <h3 style={{ color: "white" }}>
              {platform}
            </h3>

            <button
              onClick={() =>
                connectSocial(platform)
              }
              style={{
                marginTop: "10px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "white"
              }}
            >
              Connect
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Dashboard;0

