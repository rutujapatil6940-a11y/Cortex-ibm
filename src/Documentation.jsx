import { useState } from "react";
import { jsPDF } from "jspdf";
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
  // DOWNLOAD DOCUMENTATION AS PDF
const handleDownload = () => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 18;

  let y = 20;

  const checkPageBreak = (requiredHeight = 10) => {
    if (y + requiredHeight > pageHeight - bottomMargin) {
      pdf.addPage();
      y = 20;
    }
  };

  const addSectionTitle = (title) => {
    checkPageBreak(14);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(title, margin, y);

    y += 9;
  };

  const addParagraph = (value) => {
    const content =
      value || "Not found in the repository.";

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);

    const lines = pdf.splitTextToSize(
      String(content),
      contentWidth
    );

    lines.forEach((line) => {
      checkPageBreak(6);
      pdf.text(line, margin, y);
      y += 5;
    });

    y += 4;
  };

  const addBullet = (value) => {
    checkPageBreak(8);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);

    const lines = pdf.splitTextToSize(
      String(value),
      contentWidth - 7
    );

    lines.forEach((line, index) => {
      checkPageBreak(6);

      pdf.text(
        index === 0 ? `- ${line}` : `  ${line}`,
        margin,
        y
      );

      y += 5;
    });
  };

  // HEADER
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);

  pdf.text(
    "CORTEX AI PROJECT DOCUMENTATION",
    margin,
    y
  );

  y += 10;

  pdf.setFontSize(16);

  pdf.text(
    documentation.projectName,
    margin,
    y
  );

  y += 7;

  if (documentation.repository) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    const repositoryLines = pdf.splitTextToSize(
      documentation.repository,
      contentWidth
    );

    pdf.text(repositoryLines, margin, y);

    y += repositoryLines.length * 4 + 8;
  } else {
    y += 5;
  }

  // PROJECT OVERVIEW
  addSectionTitle("PROJECT OVERVIEW");
  addParagraph(documentation.overview);

  // ARCHITECTURE
  addSectionTitle("ARCHITECTURE");

  if (documentation.architecture.length > 0) {
    documentation.architecture.forEach((item) => {
      addBullet(item);
    });
  } else {
    addParagraph("Not found in the repository.");
  }

  y += 5;

  // PROJECT MODULES
  addSectionTitle("PROJECT MODULES");

  if (documentation.modules.length > 0) {
    documentation.modules.forEach(
      (module, index) => {
        checkPageBreak(14);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);

        pdf.text(
          `${index + 1}. ${module.name}`,
          margin,
          y
        );

        y += 6;

        addParagraph(module.description);
      }
    );
  } else {
    addParagraph("Not found in the repository.");
  }

  // TECHNOLOGIES
  addSectionTitle("TECHNOLOGIES");

  if (documentation.technologies.length > 0) {
    documentation.technologies.forEach(
      (technology) => {
        addBullet(
          `${technology.name} - ${technology.percentage}%`
        );
      }
    );
  } else {
    addParagraph("Not found in the repository.");
  }

  y += 5;

  // KEY FEATURES
  addSectionTitle("KEY FEATURES");

  if (documentation.features.length > 0) {
    documentation.features.forEach((feature) => {
      addBullet(feature);
    });
  } else {
    addParagraph("Not found in the repository.");
  }

  // FOOTER ON EVERY PAGE
  const totalPages =
    pdf.internal.getNumberOfPages();

  for (
    let pageNumber = 1;
    pageNumber <= totalPages;
    pageNumber++
  ) {
    pdf.setPage(pageNumber);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    pdf.text(
      `Generated by Cortex using Bob AI | Page ${pageNumber} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      {
        align: "center",
      }
    );
  }

  const safeProjectName =
    documentation.projectName
      .replace(/[^a-z0-9-_]/gi, "-")
      .replace(/-+/g, "-");

  pdf.save(
    `${safeProjectName}-Documentation.pdf`
  );
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
              This documentation was generated by Bob AI
              using the analyzed project structure, modules,
              technologies, repository context and source code.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Documentation;
