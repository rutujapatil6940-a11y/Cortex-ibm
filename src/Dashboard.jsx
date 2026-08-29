
import React, { useState } from "react";
import DecryptedText from "./DecryptedText";
import "./Dashboard.css";
import logo from "./logo.jpg";

function Dashboard({
  user,
  onLogout,
  onAnalyzeRepository,
  onNavigate,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = user?.name || "Developer";
  const displayEmail = user?.email || "developer@example.com";
  const firstLetter = displayName.charAt(0).toUpperCase();

  const navigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      console.log(`${page} clicked`);
    }
  };

  const repositories = [
    {
      name: "e-commerce-core",
      type: "GitHub",
      language: "JavaScript",
      status: "Analyzed",
      statusClass: "analyzed",
      lastScan: "2 hours ago",
    },
    {
      name: "payment-gateway",
      type: ".ZIP",
      language: "Java",
      status: "Processing",
      statusClass: "processing",
      lastScan: "12 mins ago",
    },
    {
      name: "legacy-monolith",
      type: "GitHub",
      language: "Python",
      status: "Failed",
      statusClass: "failed",
      lastScan: "3 days ago",
    },
  ];

  const query = searchQuery.trim().toLowerCase();

  const filteredRepositories = repositories.filter((repo) => {
    if (!query) return true;

    return (
      repo.name.toLowerCase().includes(query) ||
      repo.type.toLowerCase().includes(query) ||
      repo.language.toLowerCase().includes(query) ||
      repo.status.toLowerCase().includes(query)
    );
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="dashboard">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        {/* LOGO */}
        <div className="brand">
          <img
            src={logo}
            alt="Cortex Logo"
            className="brand-logo"
          />

          <span className="brand-name">
            Cortex
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            type="button"
            onClick={() => navigate("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={() => navigate("projects")}
          >
            <span>▣</span>
            Projects
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={() => navigate("bob")}
          >
            <span>✦</span>
            Bob Chat
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={() => navigate("documentation")}
          >
            <span>▤</span>
            Documentation
          </button>

        </nav>

        <div className="sidebar-bottom"></div>
      </aside>


      {/* ================= MAIN ================= */}
      <main className="dashboard-main">

        {/* ================= TOPBAR ================= */}
        <header className="topbar">

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <span>⌕</span>

            <input
              type="text"
              value={searchQuery}
              placeholder="Search projects..."
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              aria-label="Search projects"
            />

            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </form>

          {/* PROFILE */}
          <div className="topbar-right">

            <div className="profile">

              <button
                className="avatar profile-trigger"
                type="button"
                onClick={() =>
                  setShowProfile(!showProfile)
                }
              >
                {firstLetter}
              </button>

              {showProfile && (
                <div className="profile-dropdown">

                  <div className="dropdown-user">

                    <div className="dropdown-avatar">
                      {firstLetter}
                    </div>

                    <div className="dropdown-user-info">
                      <strong>
                        {displayName}
                      </strong>

                      <span>
                        {displayEmail}
                      </span>
                    </div>

                  </div>

                  <div className="dropdown-line"></div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(false);
                      navigate("profile");
                    }}
                  >
                    👤 My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(false);
                      navigate("settings");
                    }}
                  >
                    ⚙ Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(false);
                      navigate("notifications");
                    }}
                  >
                    🔔 Notifications
                  </button>

                  <div className="dropdown-line"></div>

                  <button
                    type="button"
                    className="dropdown-logout"
                    onClick={onLogout}
                  >
                    ↪ Logout
                  </button>

                </div>
              )}

            </div>
          </div>
        </header>


        {/* ================= CONTENT ================= */}
        <section className="dashboard-content">

          {/* WELCOME */}
          <div className="welcome-section">

            <div>
              <h1 className="welcome-title">

                <DecryptedText
                  text={`Welcome back, ${displayName}!`}
                  speed={60}
                  maxIterations={10}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%"
                  sequential
                  revealDirection="start"
                  animateOn="view"
                  useOriginalCharsOnly={false}
                />

              </h1>
            </div>

            <button
              className="analyze-button"
              type="button"
              onClick={onAnalyzeRepository}
            >
              + Analyze New Repository
            </button>

          </div>


          {/* STATS */}
          <div className="stats-grid">

            <button
              className="stat-card"
              type="button"
              onClick={() => navigate("projects")}
            >
              <div className="stat-icon">▣</div>

              <div>
                <span className="stat-title">
                  Projects
                </span>

                <h2>12</h2>

                <span className="stat-change">
                  +3 this week
                </span>
              </div>
            </button>


            <button
              className="stat-card"
              type="button"
              onClick={() => navigate("bob")}
            >
              <div className="stat-icon">✦</div>

              <div>
                <span className="stat-title">
                  AI Analyses
                </span>

                <h2>48</h2>

                <span className="stat-change">
                  +12 this week
                </span>
              </div>
            </button>


            <button
              className="stat-card"
              type="button"
              onClick={() => navigate("documentation")}
            >
              <div className="stat-icon">▤</div>

              <div>
                <span className="stat-title">
                  Documents
                </span>

                <h2>31</h2>

                <span className="stat-change">
                  +8 this week
                </span>
              </div>
            </button>


            <button
              className="stat-card"
              type="button"
              onClick={() => navigate("projects")}
            >
              <div className="stat-icon">✓</div>

              <div>
                <span className="stat-title">
                  Last Scan
                </span>

                <h2>2m</h2>

                <span className="stat-change">
                  Completed
                </span>
              </div>
            </button>

          </div>


          {/* REPOSITORIES HEADER */}
          <div className="section-header">

            <div>
              <h2>
                Recent Code Repositories
              </h2>

              <p>
                {searchQuery
                  ? `${filteredRepositories.length} project${
                      filteredRepositories.length !== 1
                        ? "s"
                        : ""
                    } found for "${searchQuery}"`
                  : "Your recently analyzed projects"}
              </p>
            </div>

            <button
              className="view-all"
              type="button"
              onClick={() => navigate("projects")}
            >
              View all →
            </button>

          </div>


          {/* TABLE */}
          <div className="repository-card">

            <table>

              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Type</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Last Scan</th>
                </tr>
              </thead>

              <tbody>

                {filteredRepositories.length > 0 ? (

                  filteredRepositories.map((repo, index) => (

                    <tr
                      key={index}
                      onClick={() => navigate("repository")}
                      tabIndex="0"
                    >

                      <td>
                        <div className="repo-name">

                          <span className="repo-icon">
                            ◈
                          </span>

                          {repo.name}

                        </div>
                      </td>

                      <td>
                        <span
                          className={`type-badge ${
                            repo.type === "GitHub"
                              ? "github"
                              : "zip"
                          }`}
                        >
                          {repo.type}
                        </span>
                      </td>

                      <td>
                        {repo.language}
                      </td>

                      <td>
                        <span
                          className={`status ${repo.statusClass}`}
                        >
                          ● {repo.status}
                        </span>
                      </td>

                      <td>
                        {repo.lastScan}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "35px 20px",
                      }}
                    >

                      <div
                        style={{
                          fontSize: "28px",
                          marginBottom: "8px",
                        }}
                      >
                        🔍
                      </div>

                      <strong>
                        No projects found
                      </strong>

                      <div
                        style={{
                          marginTop: "5px",
                          opacity: 0.65,
                          fontSize: "13px",
                        }}
                      >
                        Try searching for another project,
                        language, type, or status.
                      </div>

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* BOTTOM GRID */}
          <div className="bottom-grid">

            {/* BOB INSIGHT */}
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
                Your <strong>e-commerce-core</strong>{" "}
                repository contains 47 modules across
                3 technologies.
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
                onClick={() => navigate("bob")}
              >
                View AI Analysis →
              </button>

            </div>


            {/* QUICK ACTIONS */}
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
                onClick={onAnalyzeRepository}
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
                onClick={() => navigate("bob")}
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
                onClick={() => navigate("documentation")}
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


          {/* SYSTEM STATUS */}
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
