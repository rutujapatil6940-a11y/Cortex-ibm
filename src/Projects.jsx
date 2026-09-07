import { useEffect, useState } from "react";

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
        setError("Your session has expired. Please sign in again.");
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

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: "30px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <div>
        <h1>Projects</h1>

        <p>
          Your analyzed repositories and AI-generated
          project intelligence.
        </p>
      </div>

      {loading && (
        <div style={{ marginTop: "40px" }}>
          Loading projects...
        </div>
      )}

      {!loading && error && (
        <div style={{ marginTop: "40px" }}>
          <strong>Unable to load projects</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>No projects yet</h2>

          <p>
            Analyze a GitHub repository to create your
            first project.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          {projects.map((project) => (
            <button
              key={project._id}
              type="button"
              onClick={() =>
                handleProjectClick(project)
              }
              style={{
                textAlign: "left",
                padding: "24px",
                cursor: "pointer",
              }}
            >
              <h2>
                {project.name || "Unnamed Project"}
              </h2>

              <p>
                {project.analysis?.projectOverview ||
                  "No project overview available."}
              </p>

              <div>
                <strong>Status:</strong>{" "}
                {project.status || "unknown"}
              </div>

              <div>
                <strong>Repository:</strong>{" "}
                {project.owner || "Unknown"}
              </div>

              <div>
                <strong>Files:</strong>{" "}
                {project.metadata?.fileCount || 0}
              </div>

              <div style={{ marginTop: "15px" }}>
                Open Project →
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;