import "./GenerateDocumentation.css";

function GenerateDocumentation({ onBack }) {
  const documentation = {
    projectName: "Cortex AI Project",
    description:
      "AI-powered code intelligence and automated documentation system.",

    overview:
      "This project is a web-based AI code intelligence platform designed to help developers understand software repositories quickly. It analyzes the project structure, technologies, modules and source files to generate useful documentation automatically.",

    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "HTML",
      "Python",
    ],

    modules: [
      {
        name: "Authentication",
        description:
          "Handles user login, signup, password validation and authentication.",
      },
      {
        name: "Dashboard",
        description:
          "Provides users with project statistics and repository analysis options.",
      },
      {
        name: "Repository Analyzer",
        description:
          "Analyzes uploaded ZIP files or connected GitHub repositories.",
      },
      {
        name: "AI Documentation",
        description:
          "Generates automated documentation and AI-powered project insights.",
      },
    ],

    setup: [
      "Install Node.js and npm.",
      "Clone or download the project repository.",
      "Run npm install to install project dependencies.",
      "Run npm run dev to start the development server.",
    ],
  };

  const handleDownload = () => {
    alert(
      "Documentation download will be connected with the backend later."
    );
  };

  return (
    <div className="documentation-page">

      {/* HEADER */}
      <header className="documentation-header">

        <button
          className="documentation-back-button"
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="documentation-brand">
          <div className="documentation-brand-icon">
            ◇
          </div>

          <span>Cortex</span>
        </div>

        <div className="documentation-ai-badge">
          ✦ Bob AI
        </div>

      </header>


      {/* MAIN */}
      <main className="documentation-main">

        {/* TITLE */}
        <section className="documentation-title">

          <div>

            <span className="documentation-label">
              AI CODE INTELLIGENCE
            </span>

            <h1>
              Generate Documentation
            </h1>

            <p>
              Automatically generated documentation for your repository
            </p>

          </div>

          <div className="documentation-status">
            <span className="documentation-status-dot"></span>
            Documentation Ready
          </div>

        </section>


        {/* PROJECT HEADER CARD */}
        <section className="documentation-project-card">

          <div className="documentation-project-icon">
            ◈
          </div>

          <div>

            <h2>
              {documentation.projectName}
            </h2>

            <p>
              {documentation.description}
            </p>

          </div>

        </section>


        {/* CONTENT GRID */}
        <section className="documentation-grid">

          {/* PROJECT OVERVIEW */}
          <div className="documentation-card">

            <div className="documentation-card-heading">

              <div className="documentation-heading-icon">
                ✦
              </div>

              <div>
                <h2>
                  Project Overview
                </h2>

                <p>
                  AI-generated project description
                </p>
              </div>

            </div>

            <p className="documentation-text">
              {documentation.overview}
            </p>

          </div>


          {/* TECHNOLOGIES */}
          <div className="documentation-card">

            <div className="documentation-card-heading">

              <div className="documentation-heading-icon">
                ◉
              </div>

              <div>
                <h2>
                  Technologies
                </h2>

                <p>
                  Technologies detected in the repository
                </p>
              </div>

            </div>

            <div className="documentation-tech-list">

              {documentation.technologies.map(
                (technology, index) => (

                  <span
                    className="documentation-tech"
                    key={index}
                  >
                    {technology}
                  </span>

                )
              )}

            </div>

          </div>


          {/* MODULE DOCUMENTATION */}
          <div className="documentation-card documentation-full">

            <div className="documentation-card-heading">

              <div className="documentation-heading-icon">
                ⬡
              </div>

              <div>
                <h2>
                  Module Documentation
                </h2>

                <p>
                  Description of major project modules
                </p>
              </div>

            </div>


            <div className="documentation-module-list">

              {documentation.modules.map(
                (module, index) => (

                  <div
                    className="documentation-module"
                    key={index}
                  >

                    <div className="documentation-module-number">
                      {index + 1}
                    </div>

                    <div>

                      <h3>
                        {module.name}
                      </h3>

                      <p>
                        {module.description}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


          {/* SETUP GUIDE */}
          <div className="documentation-card documentation-full">

            <div className="documentation-card-heading">

              <div className="documentation-heading-icon">
                ⚙
              </div>

              <div>
                <h2>
                  Setup Guide
                </h2>

                <p>
                  Steps to run the project locally
                </p>
              </div>

            </div>


            <div className="documentation-setup-list">

              {documentation.setup.map(
                (step, index) => (

                  <div
                    className="documentation-setup-item"
                    key={index}
                  >

                    <span>
                      {index + 1}
                    </span>

                    <p>
                      {step}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </section>


        {/* DOWNLOAD CARD */}
        <section className="documentation-download">

          <div className="documentation-download-icon">
            ↓
          </div>

          <div className="documentation-download-content">

            <h2>
              Documentation Generated
            </h2>

            <p>
              Your AI-generated project documentation is ready.
              You can download it as a document when backend
              integration is completed.
            </p>

          </div>

          <button
            className="documentation-download-button"
            type="button"
            onClick={handleDownload}
          >
            ↓ Download Documentation
          </button>

        </section>

      </main>

    </div>
  );
}

export default GenerateDocumentation;