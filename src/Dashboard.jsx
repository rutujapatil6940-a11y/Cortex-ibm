import { useEffect, useState } from "react";
import DecryptedText from "./DecryptedText";
import "./Dashboard.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function Dashboard({
  user,
  analysis,
  onLogout,
  onAnalyzeRepository,
  onNavigate,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const displayName = user?.name || "Developer";
  const displayEmail =
    user?.email || "developer@example.com";

  const firstLetter =
    displayName.charAt(0).toUpperCase();

  const navigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      console.log(`${page} clicked`);
    }
  };

  // =========================================
  // LOAD PROJECTS
  // =========================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load projects"
          );
        }

        setProjects(
          Array.isArray(data.projects)
            ? data.projects
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard project loading error:",
          error
        );

        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // =========================================
  // TECHNOLOGIES
  // =========================================

  const technologyNames = (
    Array.isArray(
      analysis?.technologiesUsed
    )
      ? analysis.technologiesUsed
      : []
  )
    .map((technology) =>
      typeof technology === "string"
        ? technology
        : technology?.name ||
          technology?.technology ||
          technology?.package
    )
    .filter(Boolean);

  const insightTechnologies =
    technologyNames.slice(0, 3);

  // =========================================
  // DOCUMENT COUNT
  // =========================================
  // Total source files across all analyzed
  // projects.

  const totalDocuments = projects.reduce(
    (total, project) =>
      total +
      Number(
        project?.metadata
          ?.sourceFileCount || 0
      ),
    0
  );

  // =========================================
  // DASHBOARD COUNTS
  // =========================================

  const totalProjects =
    projects.length;

  const totalAIAnalyses =
    projects.filter(
      (project) =>
        project?.analysis &&
        typeof project.analysis ===
          "object"
    ).length;

  // =========================================
  // LAST SCAN
  // =========================================

  const getLatestProject = () => {
    if (!projects.length) {
      return null;
    }

    return [...projects].sort(
      (a, b) =>
        new Date(
          b?.updatedAt ||
            b?.createdAt ||
            0
        ) -
        new Date(
          a?.updatedAt ||
            a?.createdAt ||
            0
        )
    )[0];
  };

  const latestProject =
    getLatestProject();

  // =========================================
  // RELATIVE TIME
  // =========================================

  const formatRelativeTime = (
    dateValue
  ) => {
    if (!dateValue) {
      return "—";
    }

    const timestamp =
      new Date(dateValue).getTime();

    if (Number.isNaN(timestamp)) {
      return "—";
    }

    const difference =
      Date.now() - timestamp;

    const seconds = Math.max(
      0,
      Math.floor(
        difference / 1000
      )
    );

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days}d`;
    }

    const weeks = Math.floor(
      days / 7
    );

    if (weeks < 5) {
      return `${weeks}w`;
    }

    const months = Math.floor(
      days / 30
    );

    if (months < 12) {
      return `${months}mo`;
    }

    const years = Math.floor(
      days / 365
    );

    return `${years}y`;
  };

  const lastScanAgo =
    latestProject
      ? formatRelativeTime(
          latestProject.updatedAt ||
            latestProject.createdAt
        )
      : "—";

  // =========================================
  // CURRENT / RECENT REPOSITORIES
  // =========================================

  const repositories = (
    projects.length > 0
      ? projects
      : analysis?.repository
        ? [
            {
              name:
                analysis.repository.name,

              repositoryUrl:
                analysis.repository
                  .repositoryUrl,

              status:
                analysis.repository
                  .status ||
                "processed",

              analysis,

              updatedAt:
                new Date().toISOString(),
            },
          ]
        : []
  ).map((project) => {
    const projectAnalysis =
      project.analysis;

    const technologies =
      Array.isArray(
        projectAnalysis
          ?.technologiesUsed
      )
        ? projectAnalysis
            .technologiesUsed
        : [];

    const language =
      technologies.length > 0
        ? typeof technologies[0] ===
          "string"
          ? technologies[0]
          : technologies[0]?.name ||
            technologies[0]
              ?.technology ||
            technologies[0]
              ?.package ||
            "Not found"
        : "Not found";

    const status =
      project.status ||
      "processed";

    return {
      name:
        project.name ||
        projectAnalysis
          ?.projectName ||
        "Unnamed Project",

      type: "GitHub",

      language,

      status,

      statusClass:
        status === "failed"
          ? "failed"
          : status ===
                "processing" ||
            status ===
                "analyzing"
          ? "processing"
          : "analyzed",

      lastScan:
        formatRelativeTime(
          project.updatedAt ||
            project.createdAt
        ),
    };
  });

  // =========================================
  // SEARCH
  // =========================================

  const query =
    searchQuery
      .trim()
      .toLowerCase();

  const filteredRepositories =
    repositories.filter(
      (repo) => {
        if (!query) {
          return true;
        }

        return (
          repo.name
            .toLowerCase()
            .includes(query) ||
          repo.type
            .toLowerCase()
            .includes(query) ||
          repo.language
            .toLowerCase()
            .includes(query) ||
          repo.status
            .toLowerCase()
            .includes(query)
        );
      }
    );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="dashboard">

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* ================= TOPBAR ================= */}

        <header className="topbar">

          <form
            className="search-box"
            onSubmit={
              handleSearch
            }
          >
            <span>⌕</span>

            <input
              type="text"
              value={
                searchQuery
              }
              placeholder="Search projects..."
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              aria-label="Search projects"
            />

            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() =>
                  setSearchQuery(
                    ""
                  )
                }
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
                  setShowProfile(
                    !showProfile
                  )
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
                      setShowProfile(
                        false
                      );
                      navigate(
                        "profile"
                      );
                    }}
                  >
                    👤 My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(
                        false
                      );
                      navigate(
                        "settings"
                      );
                    }}
                  >
                    ⚙ Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(
                        false
                      );
                      navigate(
                        "notifications"
                      );
                    }}
                  >
                    🔔 Notifications
                  </button>

                  <div className="dropdown-line"></div>

                  <button
                    type="button"
                    className="dropdown-logout"
                    onClick={
                      onLogout
                    }
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
              onClick={
                onAnalyzeRepository
              }
            >
              + Analyze New Repository
            </button>

          </div>


          {/* ================= STATS ================= */}

          <div className="stats-grid">

            {/* PROJECTS */}

            <button
              className="stat-card"
              type="button"
              onClick={() =>
                navigate(
                  "projects"
                )
              }
            >

              <div className="stat-icon">
                ▣
              </div>

              <div>

                <span className="stat-title">
                  Projects
                </span>

                <h2>
                  {projectsLoading
                    ? "—"
                    : totalProjects}
                </h2>

                <span className="stat-change">
                  Total analyzed projects
                </span>

              </div>

            </button>


            {/* AI ANALYSES */}

            <button
              className="stat-card"
              type="button"
              onClick={() =>
                navigate("bob")
              }
            >

              <div className="stat-icon">
                ✦
              </div>

              <div>

                <span className="stat-title">
                  AI Analyses
                </span>

                <h2>
                  {projectsLoading
                    ? "—"
                    : totalAIAnalyses}
                </h2>

                <span className="stat-change">
                  Completed analyses
                </span>

              </div>

            </button>


            {/* DOCUMENTS */}

            <button
              className="stat-card"
              type="button"
              onClick={() =>
                navigate(
                  "documentation"
                )
              }
            >

              <div className="stat-icon">
                ▤
              </div>

              <div>

                <span className="stat-title">
                  Documents
                </span>

                <h2>
                  {projectsLoading
                    ? "—"
                    : totalDocuments}
                </h2>

                <span className="stat-change">
                  Across{" "}
                  {totalProjects}{" "}
                  projects
                </span>

              </div>

            </button>


            {/* LAST SCAN */}

            <button
              className="stat-card"
              type="button"
              onClick={() =>
                navigate(
                  "upload"
                )
              }
            >

              <div className="stat-icon">
                ✓
              </div>

              <div>

                <span className="stat-title">
                  Last Scan
                </span>

                <h2>
                  {projectsLoading
                    ? "—"
                    : latestProject
                      ? `${lastScanAgo} ago`
                      : "—"}
                </h2>

                <span className="stat-change">
                  {latestProject
                    ? "Completed"
                    : "No scan yet"}
                </span>

              </div>

            </button>

          </div>


          {/* ================= REPOSITORIES HEADER ================= */}

          <div className="section-header">

            <div>

              <h2>
                Recent Code Repositories
              </h2>

              <p>
                {searchQuery
                  ? `${filteredRepositories.length} project${
                      filteredRepositories.length !==
                      1
                        ? "s"
                        : ""
                    } found for "${searchQuery}"`
                  : "Your recently analyzed projects"}
              </p>

            </div>

            <button
              className="view-all"
              type="button"
              onClick={() =>
                navigate(
                  "projects"
                )
              }
            >
              View all →
            </button>

          </div>


          {/* ================= TABLE ================= */}

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

                {filteredRepositories.length >
                0 ? (

                  filteredRepositories
                    .slice(0, 5)
                    .map(
                      (
                        repo,
                        index
                      ) => (

                        <tr
                          key={`${repo.name}-${index}`}
                          onClick={() =>
                            navigate(
                              "projects"
                            )
                          }
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
                                repo.type ===
                                "GitHub"
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
                              ●{" "}
                              {repo.status}
                            </span>

                          </td>

                          <td>
                            {repo.lastScan}
                          </td>

                        </tr>

                      )
                    )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "35px 20px",
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            "28px",
                          marginBottom:
                            "8px",
                        }}
                      >
                        {projectsLoading
                          ? "⏳"
                          : "🔍"}
                      </div>

                      <strong>
                        {projectsLoading
                          ? "Loading projects..."
                          : "No projects found"}
                      </strong>

                      {!projectsLoading && (
                        <div
                          style={{
                            marginTop:
                              "5px",
                            opacity:
                              0.65,
                            fontSize:
                              "13px",
                          }}
                        >
                          Try searching for
                          another project,
                          language, type,
                          or status.
                        </div>
                      )}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* ================= BOTTOM GRID ================= */}

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
                {analysis?.projectOverview ||
                  "Analyze a GitHub repository to view Bob's actual findings here."}
              </p>

              {insightTechnologies.map(
                (
                  technology
                ) => {

                  const percentage =
                    Math.round(
                      100 /
                        insightTechnologies.length
                    );

                  return (
                    <div
                      className="technology"
                      key={
                        technology
                      }
                    >

                      <span>
                        {technology}
                      </span>

                      <div className="progress">

                        <div
                          className="progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <span>
                        {percentage}%
                      </span>

                    </div>
                  );
                }
              )}

              <button
                className="insight-button"
                type="button"
                onClick={() =>
                  navigate(
                    "bob"
                  )
                }
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
                onClick={
                  onAnalyzeRepository
                }
              >

                <span className="action-icon">
                  ↑
                </span>

                <div>

                  <strong>
                    Upload Repository
                  </strong>

                  <small>
                    Upload a GitHub repository for analysis
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>


              <button
                className="action-item"
                type="button"
                onClick={() =>
                  navigate("bob")
                }
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
                onClick={() =>
                  navigate(
                    "documentation"
                  )
                }
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
              Current Tier:{" "}
              <strong>
                MVP
              </strong>
            </span>

          </footer>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;