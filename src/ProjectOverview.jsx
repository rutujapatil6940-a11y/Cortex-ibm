
import React from "react";
import "./ProjectOverview.css";
import logo from "./logo.jpg";

function ProjectOverview({
  onBack,
  onDocumentation,
  onDetailedAnalysis,
  onCodeStructure,
  onDependencies,
}) {
  const project = {
    name: "e-commerce-core",
    description:
      "A modern e-commerce platform with product management, authentication, shopping cart and payment functionality.",
    repository: "https://github.com/username/e-commerce-core",

    files: 128,
    lines: "24.6K",
    languages: 4,
    moduleCount: 12,

    technologies: [
      { name: "JavaScript", percentage: 48, type: "js" },
      { name: "CSS", percentage: 27, type: "css" },
      { name: "HTML", percentage: 15, type: "html" },
      { name: "Python", percentage: 10, type: "python" },
    ],

    modules: [
      {
        name: "Authentication",
        description: "Login, signup and user authentication",
      },
      {
        name: "Product Management",
        description: "Product listing, creation and management",
      },
      {
        name: "Shopping Cart",
        description: "Cart management and checkout functionality",
      },
      {
        name: "Payment Gateway",
        description: "Payment processing and transaction handling",
      },
    ],

    summary: [
      "The repository contains a complete e-commerce application.",
      "The codebase is organized into multiple modules for authentication, products, cart and payments.",
      "Bob AI analyzed the repository structure and identified the major technologies and components.",
    ],

    insights: [
      {
        type: "success",
        text: "Repository structure is well organized.",
      },
      {
        type: "success",
        text: "Authentication and product modules are clearly separated.",
      },
      {
        type: "warning",
        text: "Some components could be optimized for better performance.",
      },
    ],
  };

  const handleReAnalyze = () => {
    alert(
      "Re-analysis started! This is currently a frontend demo. Backend AI integration will be added later."
    );
  };

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

          {/* CORTEX LOGO */}
          <div className="project-brand-icon">
            <img
              src={logo}
              alt="Cortex Logo"
            />
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
