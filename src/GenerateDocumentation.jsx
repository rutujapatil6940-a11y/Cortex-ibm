import "./GenerateDocumentation.css";

function GenerateDocumentation({ onBack, analysis }) {
  const array = (value) => Array.isArray(value) ? value : [];
  const text = (value) => typeof value === "string" ? value : value?.name || value?.technology || value?.package || value?.description || value?.purpose || "Not found in the repository.";
  const documentation = {
    projectName: analysis?.projectName || analysis?.repository?.name || "Repository",
    description: analysis?.projectOverview || "Not found in the repository.",
    overview: analysis?.projectOverview || "Not found in the repository.",
    technologies: array(analysis?.technologiesUsed).map(text),
    modules: array(analysis?.importantFunctionsAndComponents).map((item) => ({ name: text(item), description: typeof item === "object" ? item?.purpose || item?.behavior || "Not found in the repository." : "Not found in the repository." })),
    setup: array(analysis?.setupInstructions).map(text),
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

      </main>

    </div>
  );
}

export default GenerateDocumentation;
