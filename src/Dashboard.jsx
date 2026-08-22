import Gradient from "./Gradient";
import "./Dashboard.css";
function Dashboard({ onLogout, onAnalyzeRepository }) {
  return (
    <div className="dashboard">

      {/* ================= BACKGROUND ================= */}

      <div className="gradient-background">
        <Gradient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B497CF"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">
          <div className="brand-icon">◇</div>
          <span>Cortex</span>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            type="button"
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <span>▣</span>
            Projects
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <span>✦</span>
            Bob Chat
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <span>▤</span>
            Documentation
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <span>◇</span>
            Architecture
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className="nav-item"
            type="button"
          >
            <span>⚙</span>
            Settings
          </button>

          {/* ================= LOGOUT ================= */}

          <button
            className="nav-item logout"
            type="button"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* ================= TOP BAR ================= */}

        <header className="topbar">

          {/* SEARCH */}

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search projects..."
            />
          </div>

          {/* TOP RIGHT */}

          <div className="topbar-right">

            <button
              className="notification"
              type="button"
              aria-label="Notifications"
            >
              ♢
            </button>

            <div className="profile">

              <div className="avatar">
                R
              </div>

              <div className="profile-info">

                <span className="profile-name">
                  Developer
                </span>

                <span className="profile-role">
                  Developer
                </span>

              </div>

              <span className="arrow">
                ▾
              </span>

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <section className="dashboard-content">

          {/* ================= WELCOME ================= */}

          <div className="welcome-section">

            <div>

              <h1>
                Welcome back, Developer!
              </h1>

              <p>
                Your AI-powered development workspace
              </p>

            </div>

            <button
  className="analyze-button"
  type="button"
  onClick={onAnalyzeRepository}
>
  + Analyze New Repository
</button>

          </div>

          {/* ================= STATS ================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                ▣
              </div>

              <div>

                <span className="stat-title">
                  Projects
                </span>

                <h2>
                  12
                </h2>

                <span className="stat-change">
                  +3 this week
                </span>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ✦
              </div>

              <div>

                <span className="stat-title">
                  AI Analyses
                </span>

                <h2>
                  48
                </h2>

                <span className="stat-change">
                  +12 this week
                </span>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ▤
              </div>

              <div>

                <span className="stat-title">
                  Documents
                </span>

                <h2>
                  31
                </h2>

                <span className="stat-change">
                  +8 this week
                </span>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ✓
              </div>

              <div>

                <span className="stat-title">
                  Last Scan
                </span>

                <h2>
                  2m
                </h2>

                <span className="stat-change">
                  Completed
                </span>

              </div>

            </div>

          </div>

          {/* ================= REPOSITORIES ================= */}

          <div className="section-header">

            <div>

              <h2>
                Recent Code Repositories
              </h2>

              <p>
                Your recently analyzed projects
              </p>

            </div>

            <button
              className="view-all"
              type="button"
            >
              View all →
            </button>

          </div>

          {/* ================= REPOSITORY TABLE ================= */}

          <div className="repository-card">

            <table>

              <thead>

                <tr>

                  <th>
                    Repository
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Language
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Last Scan
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>

                    <div className="repo-name">

                      <span className="repo-icon">
                        ◈
                      </span>

                      e-commerce-core

                    </div>

                  </td>

                  <td>

                    <span className="type-badge github">
                      GitHub
                    </span>

                  </td>

                  <td>
                    JavaScript
                  </td>

                  <td>

                    <span className="status analyzed">
                      ● Analyzed
                    </span>

                  </td>

                  <td>
                    2 hours ago
                  </td>

                </tr>

                <tr>

                  <td>

                    <div className="repo-name">

                      <span className="repo-icon">
                        ◈
                      </span>

                      payment-gateway

                    </div>

                  </td>

                  <td>

                    <span className="type-badge zip">
                      .ZIP
                    </span>

                  </td>

                  <td>
                    Java
                  </td>

                  <td>

                    <span className="status processing">
                      ● Processing
                    </span>

                  </td>

                  <td>
                    12 mins ago
                  </td>

                </tr>

                <tr>

                  <td>

                    <div className="repo-name">

                      <span className="repo-icon">
                        ◈
                      </span>

                      legacy-monolith

                    </div>

                  </td>

                  <td>

                    <span className="type-badge github">
                      GitHub
                    </span>

                  </td>

                  <td>
                    Python
                  </td>

                  <td>

                    <span className="status failed">
                      ● Failed
                    </span>

                  </td>

                  <td>
                    3 days ago
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          {/* ================= BOTTOM GRID ================= */}

          <div className="bottom-grid">

            {/* ================= BOB INSIGHT ================= */}

            <div className="insight-card">

              <div className="card-heading">

                <span className="heading-icon">
                  ✦
                </span>

                <h2>
                  Bob's Insight
                </h2>

              </div>

              <p>
                Your <strong>e-commerce-core</strong> repository
                contains 47 modules across 3 technologies.
              </p>

              <div className="technology">

                <span>
                  JavaScript
                </span>

                <div className="progress">

                  <div
                    className="progress-fill"
                    style={{ width: "62%" }}
                  />

                </div>

                <span>
                  62%
                </span>

              </div>

              <div className="technology">

                <span>
                  CSS
                </span>

                <div className="progress">

                  <div
                    className="progress-fill"
                    style={{ width: "25%" }}
                  />

                </div>

                <span>
                  25%
                </span>

              </div>

              <div className="technology">

                <span>
                  HTML
                </span>

                <div className="progress">

                  <div
                    className="progress-fill"
                    style={{ width: "13%" }}
                  />

                </div>

                <span>
                  13%
                </span>

              </div>

              <button
                className="insight-button"
                type="button"
              >
                View AI Analysis →
              </button>

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="actions-card">

              <div className="card-heading">

                <span className="heading-icon">
                  ⚡
                </span>

                <h2>
                  Quick Actions
                </h2>

              </div>

              <button
                className="action-item"
                type="button"
              >

                <span className="action-icon">
                  ↑
                </span>

                <div>

                  <strong>
                    Upload Repository
                  </strong>

                  <small>
                    Upload a ZIP file
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>

              <button
                className="action-item"
                type="button"
              >

                <span className="action-icon">
                  🔗
                </span>

                <div>

                  <strong>
                    GitHub Repository
                  </strong>

                  <small>
                    Connect a repository
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>

              <button
                className="action-item"
                type="button"
              >

                <span className="action-icon">
                  ✦
                </span>

                <div>

                  <strong>
                    Ask Bob
                  </strong>

                  <small>
                    Chat with your AI assistant
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>

              <button
                className="action-item"
                type="button"
              >

                <span className="action-icon">
                  ▤
                </span>

                <div>

                  <strong>
                    Generate Documentation
                  </strong>

                  <small>
                    Create project documentation
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>

            </div>

          </div>

          {/* ================= SYSTEM STATUS ================= */}

          <footer className="system-status">

            <span>
              ● All Systems Operational
            </span>

            <span>
              Current Tier: <strong>MVP</strong>
            </span>

          </footer>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;