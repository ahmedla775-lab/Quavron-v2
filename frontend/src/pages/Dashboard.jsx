function Dashboard() {

  return (

    <div className="dashboard-page">

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-left">

          <p className="hero-badge">
            🚀 QUAVRON ECOSYSTEM
          </p>

          <h1>
            Build The Future.
          </h1>

          <h2>
            Code. Create. Deploy. Connect.
          </h2>

          <p className="hero-text">

            The next generation developer ecosystem
            powered by AI, cloud infrastructure,
            realtime collaboration and social coding.

          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Start Building
            </button>

            <button className="secondary-btn">
              Explore Community
            </button>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="hero-right">

          <div className="ai-card">

            <div className="ai-card-top">

              <span className="live-dot"></span>

              AI Connected

            </div>

            <div className="ai-terminal">

              <p>✔ GitHub Synced</p>
              <p>✔ Deployment Active</p>
              <p>✔ Realtime Collaboration</p>
              <p>✔ AI Assistant Online</p>

            </div>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="stats-section">

        <div className="stat-card">
          <h2>2.4M+</h2>
          <p>Developers</p>
        </div>

        <div className="stat-card">
          <h2>410K+</h2>
          <p>Projects</p>
        </div>

        <div className="stat-card">
          <h2>12M+</h2>
          <p>Deployments</p>
        </div>

        <div className="stat-card">
          <h2>98</h2>
          <p>Countries</p>
        </div>

      </section>

      {/* PROJECTS */}

      <section className="projects-section">

        <div className="section-title">

          <h2>🔥 Trending Projects</h2>

          <button>
            View All
          </button>

        </div>

        <div className="projects-grid">

          <div className="project-card">

            <div className="project-top">

              <h3>AI SaaS Platform</h3>

              <span>React</span>

            </div>

            <p>
              Next generation AI powered SaaS dashboard.
            </p>

            <div className="project-footer">

              <button>Fork</button>

              <button>Deploy</button>

            </div>

          </div>

          <div className="project-card">

            <div className="project-top">

              <h3>Realtime Chat App</h3>

              <span>Node.js</span>

            </div>

            <p>
              Modern realtime communication platform.
            </p>

            <div className="project-footer">

              <button>Fork</button>

              <button>Deploy</button>

            </div>

          </div>

          <div className="project-card">

            <div className="project-top">

              <h3>Cloud IDE</h3>

              <span>Vite</span>

            </div>

            <p>
              Browser based VSCode alternative.
            </p>

            <div className="project-footer">

              <button>Fork</button>

              <button>Deploy</button>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}

export default Dashboard;
