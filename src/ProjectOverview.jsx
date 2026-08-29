import "./ProjectOverview.css";

function ProjectOverview({
  onBack,
  onDocumentation,
  onDetailedAnalysis,
  onCodeStructure,
  onDependencies,
  analysis,
}) {
  const emptyProject = {
    name: "Analysis unavailable", description: "No repository analysis has been returned.", repository: "",
    files: 0, lines: "—", languages: 0, moduleCount: 0, technologies: [], modules: [], summary: [], insights: [],
  };

  const list = (value) => (Array.isArray(value) ? value : []);
  const values = (items, keys) => list(items).map((item) => {
    if (typeof item === "string") return item;
    return keys.map((key) => item?.[key]).find(Boolean) || "Not found in the repository.";
  });

  const analyzedTechnologies = values(analysis?.technologiesUsed, ["name", "technology", "package"]);
  const analyzedModules = list(analysis?.importantFunctionsAndComponents).map((item) => ({
    name: typeof item === "string" ? item : item?.name || item?.component || "Component",
    description: typeof item === "string" ? "No component description was returned." : item?.purpose || item?.behavior || "No component description was returned.",
  }));
  const project = analysis ? {
    ...emptyProject,
    name: analysis.projectName || analysis.repository?.name || "Not found in the repository.",
    description: analysis.projectOverview || "Not found in the repository.",
    repository: analysis.repository?.repositoryUrl || "",
    files: analysis.repository?.metadata?.fileCount || 0,
    lines: analysis.repository?.metadata?.sourceBytes ? `${Math.round(analysis.repository.metadata.sourceBytes / 1024)} KB` : "—",
    languages: analyzedTechnologies.length,
    moduleCount: analyzedModules.length,
    technologies: analyzedTechnologies.map((name, index, all) => ({
      name,
      percentage: Math.round(100 / all.length),
      type: "js",
    })),
    modules: analyzedModules,
    summary: [analysis.projectOverview, ...values(analysis.howTheProjectWorks, ["description", "purpose"])].filter(Boolean).slice(0, 3),
    insights: values(analysis.potentialImportantNotes, ["text", "note", "description"]).slice(0, 3).map((text) => ({ type: "success", text })),
  } : emptyProject;

  const handleReAnalyze = onBack;

  const handleDependencies = () => {
    if (onDependencies) {
      onDependencies();
    } else {
      alert(
        "Dependency analysis page will be connected with the backend later."
      );
    }
  };

  return (
    <div className="project-overview-page">

      {/* HEADER */}
      <header className="project-header">

        <button
          className="project-back-button"
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="project-brand">
          <div className="project-brand-icon">
            ◇
          </div>

          <span>Cortex</span>
        </div>

      
      </header>

      {/* MAIN */}
      <main className="project-main">

        {/* TITLE */}
        <section className="project-title-section">

          <div>
            <h1>𝑷𝒓𝒐𝒋𝒆𝒄𝒕 𝑶𝒗𝒆𝒓𝒗𝒊𝒆𝒘</h1>

            
          </div>

          <div className="analysis-status">
            <span className="status-dot"></span>
            Analysis Complete
          </div>

        </section>

        {/* PROJECT INFO */}
        <section className="project-info-card">

          <div className="project-info-left">

            <div className="repo-large-icon">
              ◈
            </div>

            <div>

              <h2>
                {project.name}
              </h2>

              <p>
                {project.description}
              </p>

              <a
                href={project.repository}
                target="_blank"
                rel="noreferrer"
                className="repository-url"
                onClick={(e) => e.stopPropagation()}
              >
                {project.repository}
              </a>

            </div>

          </div>

          <button
            className="reanalyze-button"
            type="button"
            onClick={handleReAnalyze}
          >
            ↻ Re-analyze
          </button>

        </section>

        {/* STATISTICS */}
        <section className="overview-stats">

          <div className="overview-stat-card">
            <div className="overview-stat-icon">◫</div>

            <div>
              <span>Files</span>
              <strong>{project.files}</strong>
            </div>
          </div>

          <div className="overview-stat-card">
            <div className="overview-stat-icon">#</div>

            <div>
              <span>Lines of Code</span>
              <strong>{project.lines}</strong>
            </div>
          </div>

          <div className="overview-stat-card">
            <div className="overview-stat-icon">◉</div>

            <div>
              <span>Languages</span>
              <strong>{project.languages}</strong>
            </div>
          </div>

          <div className="overview-stat-card">
            <div className="overview-stat-icon">⬡</div>

            <div>
              <span>Modules</span>
              <strong>{project.moduleCount}</strong>
            </div>
          </div>

        </section>

        {/* MAIN GRID */}
        <section className="overview-grid">

          {/* PROJECT SUMMARY */}
          <div className="overview-card">

            <div className="overview-card-heading">

              <div className="heading-symbol">
                ✦
              </div>

              <div>
                <h2>Project Summary</h2>

                <p>
                  AI-generated project understanding
                </p>
              </div>

            </div>

            <div>
              {project.summary.map((text, index) => (
                <p
                  className="summary-text"
                  key={index}
                >
                  {text}
                </p>
              ))}
            </div>

          </div>

          {/* TECHNOLOGIES */}
          <div className="overview-card">

            <div className="overview-card-heading">

              <div className="heading-symbol">
                ◉
              </div>

              <div>
                <h2>Technologies</h2>

                <p>
                  Detected technologies
                </p>
              </div>

            </div>

            <div className="technology-list">

              {project.technologies.map(
                (technology, index) => (
                  <div key={index}>

                    <div className="technology-row">

                      <div className="technology-name">

                        <div
                          className={`tech-icon ${technology.type}`}
                        >
                          {technology.name
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>

                        <span>
                          {technology.name}
                        </span>

                      </div>

                      <span>
                        {technology.percentage}%
                      </span>

                    </div>

                    <div className="technology-progress">

                      <div
                        className="technology-progress-fill"
                        style={{
                          width: `${technology.percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* PROJECT MODULES */}
          <div className="overview-card">

            <div className="overview-card-heading">

              <div className="heading-symbol">
                ⬡
              </div>

              <div>
                <h2>Project Modules</h2>

                <p>
                  Main components detected
                </p>
              </div>

            </div>

            <div className="module-list">

              {project.modules.map(
                (module, index) => (
                  <button
                    className="module-item"
                    key={index}
                    type="button"
                    onClick={() =>
                      alert(
                        `${module.name}\n\n${module.description}`
                      )
                    }
                  >

                    <div className="module-icon">
                      ◇
                    </div>

                    <div>
                      <strong>
                        {module.name}
                      </strong>

                      <span>
                        {module.description}
                      </span>
                    </div>

                    <b>→</b>

                  </button>
                )
              )}

            </div>

          </div>

          {/* AI INSIGHTS */}
          <div className="overview-card">

            <div className="overview-card-heading">

              <div className="heading-symbol">
                ✦
              </div>

              <div>
                <h2>AI Insights</h2>

                <p>
                  Bob AI findings
                </p>
              </div>

            </div>

            {project.insights.map(
              (insight, index) => (
                <div
                  className="insight-item"
                  key={index}
                >

                  <div
                    className={
                      insight.type === "success"
                        ? "insight-check"
                        : "insight-warning"
                    }
                  >
                    {insight.type === "success"
                      ? "✓"
                      : "!"}
                  </div>

                  <p>
                    {insight.text}
                  </p>

                </div>
              )
            )}

            <button
              className="view-analysis-button"
              type="button"
              onClick={() => {
                if (onDetailedAnalysis) {
                  onDetailedAnalysis();
                }
              }}
            >
              View Detailed Analysis →
            </button>

          </div>

        </section>

        {/* CONTINUE EXPLORING */}
        <section className="next-actions">

          <h2>
            Continue Exploring
          </h2>

          <p>
            Explore different parts of your analyzed
            codebase.
          </p>

          <div className="next-action-buttons">

            {/* DOCUMENTATION */}
            <button
              className="next-action"
              type="button"
              onClick={() => {
                if (onDocumentation) {
                  onDocumentation();
                }
              }}
            >

              <span>◫</span>

              <div>
                Generate Documentation
              </div>

              <b>→</b>

            </button>

            {/* CODE STRUCTURE */}
            <button
              className="next-action"
              type="button"
              onClick={() => {
                if (onCodeStructure) {
                  onCodeStructure();
                }
              }}
            >

              <span>◈</span>

              <div>
                Explore Code Structure
              </div>

              <b>→</b>

            </button>

            {/* DEPENDENCIES */}
            <button
              className="next-action"
              type="button"
              onClick={handleDependencies}
            >

              <span>⬡</span>

              <div>
                View Dependencies
              </div>

              <b>→</b>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProjectOverview;
