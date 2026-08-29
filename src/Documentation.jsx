import { useState } from "react";
import "./Documentation.css";

function Documentation({ onBack, analysis }) {
  const [copied, setCopied] = useState(false);

  const array = (value) => Array.isArray(value) ? value : [];
  const text = (value) => typeof value === "string" ? value : value?.name || value?.technology || value?.package || value?.description || value?.purpose || "Not found in the repository.";
  const technologies = array(analysis?.technologiesUsed).map(text);
  const modules = array(analysis?.importantFunctionsAndComponents).map((item) => ({ name: text(item), description: typeof item === "object" ? item?.purpose || item?.behavior || "Not found in the repository." : "Not found in the repository." }));
  const documentation = {
    projectName: analysis?.projectName || analysis?.repository?.name || "Repository",
    repository: analysis?.repository?.repositoryUrl || "",
    overview: analysis?.projectOverview || "Not found in the repository.",
    architecture: array(analysis?.dataFlow).map(text),
    modules,
    technologies: technologies.map((name, index, all) => ({ name, percentage: Math.round(100 / all.length) })),
    features: array(analysis?.howTheProjectWorks).map(text),
  };

  // COPY DOCUMENTATION
  const handleCopy = async () => {
    const text = `
CORTEX AI PROJECT

Project Overview:
${documentation.overview}

Architecture:
${documentation.architecture.join("\n")}

Modules:
${documentation.modules
  .map((module) => `${module.name}: ${module.description}`)
  .join("\n")}

Technologies:
${documentation.technologies
  .map((tech) => `${tech.name}: ${tech.percentage}%`)
  .join("\n")}

Features:
${documentation.features.join("\n")}
    `;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Unable to copy documentation.");
    }
  };

  // DOWNLOAD DOCUMENTATION
  const handleDownload = () => {
    const text = `
CORTEX AI PROJECT
=================

PROJECT OVERVIEW
${documentation.overview}

ARCHITECTURE
${documentation.architecture
  .map((item) => "- " + item)
  .join("\n")}

PROJECT MODULES
${documentation.modules
  .map(
    (module) =>
      `${module.name}\n${module.description}\n`
  )
  .join("\n")}

TECHNOLOGIES
${documentation.technologies
  .map(
    (technology) =>
      `${technology.name}: ${technology.percentage}%`
  )
  .join("\n")}

KEY FEATURES
${documentation.features
  .map((feature) => "- " + feature)
  .join("\n")}
`;

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Cortex-AI-Documentation.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // REGENERATE
  const handleRegenerate = () => {
    alert(
      "Documentation regenerated successfully! (Frontend Demo)"
    );
  };

  return (
    <div className="documentation-page">

      {/* HEADER */}
      <header className="documentation-header">

        <button
          type="button"
          className="documentation-back-button"
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

        

      </header>


      {/* MAIN */}
      <main className="documentation-main">

        {/* TITLE */}
        <section className="documentation-title">

          <div>
            

            <h1>
              𝑷𝒓𝒐𝒋𝒆𝒄𝒕 𝑫𝒐𝒄𝒖𝒎𝒆𝒏𝒕𝒂𝒕𝒊𝒐𝒏 
            </h1>

         
          </div>

          <div className="documentation-status">
            <span></span>
            Documentation Generated
          </div>

        </section>


        {/* PROJECT CARD */}
        <section className="documentation-project-card">

          <div className="documentation-project-icon">
            ◈
          </div>

          <div>
            <h2>
              {documentation.projectName}
            </h2>

            <p>
              {documentation.overview}
            </p>

            <span className="documentation-repository">
              {documentation.repository}
            </span>
          </div>

        </section>


        {/* ACTION BUTTONS */}
        <section className="documentation-actions">

          <button
            type="button"
            onClick={handleDownload}
            className="documentation-action primary"
          >
            ↓ Download Documentation
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="documentation-action"
          >
            {copied
              ? "✓ Copied"
              : "▣ Copy Documentation"}
          </button>

          <button
            type="button"
            onClick={handleRegenerate}
            className="documentation-action"
          >
            ↻ Regenerate
          </button>

        </section>


        {/* OVERVIEW + ARCHITECTURE */}
        <section className="documentation-grid">

          {/* OVERVIEW */}
          <div className="documentation-card">

            <div className="documentation-heading">

              <div className="documentation-heading-icon">
                ✦
              </div>

              <div>
                <h2>
                  Project Overview
                </h2>

                <p>
                  Understanding of the project
                </p>
              </div>

            </div>

            <p className="documentation-text">
              {documentation.overview}
            </p>

          </div>


          {/* ARCHITECTURE */}
          <div className="documentation-card">

            <div className="documentation-heading">

              <div className="documentation-heading-icon">
                ◈
              </div>

              <div>
                <h2>
                  Architecture
                </h2>

                <p>
                  Technology architecture
                </p>
              </div>

            </div>

            <div className="architecture-list">

              {documentation.architecture.map(
                (item, index) => (
                  <div
                    className="architecture-item"
                    key={index}
                  >
                    <span>✓</span>
                    <p>{item}</p>
                  </div>
                )
              )}

            </div>

          </div>

        </section>


        {/* MODULES */}
        <section className="documentation-card full-card">

          <div className="documentation-heading">

            <div className="documentation-heading-icon">
              ⬡
            </div>

            <div>
              <h2>
                Project Modules
              </h2>

              <p>
                Main modules detected in the repository
              </p>
            </div>

          </div>

          <div className="documentation-modules">

            {documentation.modules.map(
              (module, index) => (

                <div
                  className="documentation-module"
                  key={index}
                >

                  <div className="module-number">
                    {String(index + 1).padStart(2, "0")}
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

        </section>


        {/* TECHNOLOGIES */}
        <section className="documentation-card full-card">

          <div className="documentation-heading">

            <div className="documentation-heading-icon">
              ◉
            </div>

            <div>
              <h2>
                Technologies
              </h2>

              <p>
                Technologies detected in the codebase
              </p>
            </div>

          </div>

          <div className="documentation-technologies">

            {documentation.technologies.map(
              (technology, index) => (

                <div
                  className="documentation-technology"
                  key={index}
                >

                  <div className="technology-top">

                    <span>
                      {technology.name}
                    </span>

                    <strong>
                      {technology.percentage}%
                    </strong>

                  </div>

                  <div className="documentation-progress">

                    <div
                      style={{
                        width: `${technology.percentage}%`,
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* FEATURES */}
        <section className="documentation-card full-card">

          <div className="documentation-heading">

            <div className="documentation-heading-icon">
              ✦
            </div>

            <div>
              <h2>
                Key Features
              </h2>

              <p>
                Major capabilities of the project
              </p>
            </div>

          </div>

          <div className="feature-list">

            {documentation.features.map(
              (feature, index) => (

                <div
                  className="feature-item"
                  key={index}
                >

                  <span>
                    ✓
                  </span>

                  <p>
                    {feature}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* AI NOTE */}
        <section className="documentation-ai-note">

          <div className="documentation-ai-icon">
            ✦
          </div>

          <div>

            <h2>
              Generated by Bob AI
            </h2>

            <p>
              This documentation was generated by
              analyzing the project structure, modules,
              technologies and source code. Backend AI
              integration will provide real repository-based
              documentation in the future.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Documentation;
