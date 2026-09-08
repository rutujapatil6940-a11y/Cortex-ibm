import { useEffect, useState } from "react";
import "./Projects.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function Projects({
  onBack,
  onSelectProject,
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Your session has expired. Please sign in again."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/projects`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load projects."
          );
        }

        setProjects(
          Array.isArray(data.projects)
            ? data.projects
            : []
        );
      } catch (err) {
        console.error("Projects fetch error:", err);

        setError(
          err.message || "Unable to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(
      status || "unknown"
    ).toLowerCase();

    return normalizedStatus.replace(/\s+/g, "_");
  };

  return (
    <div className="projects-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="projects-header">

        <button
          className="projects-back-button"
          type="button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="projects-brand">

          <div className="projects-brand-icon">
            ◇
          </div>

          <span>
            CodeAlpha
          </span>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="projects-main">

        {/* =================================================
            TITLE
        ================================================= */}

        <section className="projects-title-section">

          <div className="projects-title-content">

            <h1>
              Projects
            </h1>

            <p>
              Your analyzed repositories and AI-generated
              project intelligence.
            </p>

          </div>

          {!loading && !error && projects.length > 0 && (
            <div className="projects-count">
              {projects.length}{" "}
              {projects.length === 1
                ? "Project"
                : "Projects"}
            </div>
          )}

        </section>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="projects-loading">
            Loading your projects...
          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="projects-state-card">

            <div className="projects-state-icon">
              !
            </div>

            <h2>
              Unable to load projects
            </h2>

            <p>
              {error}
            </p>

          </div>
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="projects-state-card">

              <div className="projects-state-icon">
                ◇
              </div>

              <h2>
                No projects yet
              </h2>

              <p>
                Analyze a GitHub repository to create
                your first CodeAlpha project.
              </p>

            </div>
          )}


        {/* =================================================
            PROJECT GRID
        ================================================= */}

        {!loading &&
          !error &&
          projects.length > 0 && (

            <section className="projects-grid">

              {projects.map((project) => {

                const status =
                  project.status || "unknown";

                const description =
                  project.analysis?.projectOverview ||
                  "No project overview available.";

                const fileCount =
                  project.metadata?.fileCount || 0;

                const sourceFileCount =
                  project.metadata?.sourceFileCount || 0;

                const defaultBranch =
                  project.metadata?.defaultBranch ||
                  "Not specified";

                const owner =
                  project.owner ||
                  "Unknown";

                return (
                  <button
                    key={project._id}
                    type="button"
                    className="project-card"
                    onClick={() =>
                      handleProjectClick(project)
                    }
                  >

                    {/* CARD TOP */}

                    <div className="project-card-top">

                      <div className="project-card-identity">

                        <div className="project-card-icon">
                          ◈
                        </div>

                        <div className="project-card-name">

                          <h2>
                            {project.name ||
                              "Unnamed Project"}
                          </h2>

                          <span>
                            {owner}
                          </span>

                        </div>

                      </div>


                      <span
                        className={`project-status ${getStatusClass(
                          status
                        )}`}
                      >
                        {status.replace(/_/g, " ")}
                      </span>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="project-card-description">
                      {description}
                    </p>


                    {/* METADATA */}

                    <div className="project-card-meta">

                      <div className="project-meta-item">

                        <span>
                          Files
                        </span>

                        <strong>
                          {fileCount}
                        </strong>

                      </div>


                      <div className="project-meta-item">

                        <span>
                          Source Files
                        </span>

                        <strong>
                          {sourceFileCount}
                        </strong>

                      </div>


                      <div className="project-meta-item">

                        <span>
                          Branch
                        </span>

                        <strong>
                          {defaultBranch}
                        </strong>

                      </div>

                    </div>


                    {/* REPOSITORY */}

                    <div className="project-repository">

                      <span className="project-repository-icon">
                        ◇
                      </span>

                      <span>
                        {project.repositoryUrl ||
                          "Repository URL unavailable"}
                      </span>

                    </div>


                    {/* ACTION */}

                    <div className="project-card-action">

                      <span>
                        Open Project
                      </span>

                      <span>
                        →
                      </span>

                    </div>

                  </button>
                );
              })}

            </section>
          )}

      </main>

    </div>
  );
}

export default Projects;