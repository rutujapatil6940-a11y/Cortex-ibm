import "./DetailedAnalysis.css";

function DetailedAnalysis({ onBack, analysis: repositoryAnalysis }) {
  // =========================================
  // HELPERS
  // =========================================

  const asText = (item) => {
    if (typeof item === "string") {
      return item.trim();
    }

    if (!item || typeof item !== "object") {
      return "";
    }

    return (
      item.text ||
      item.description ||
      item.note ||
      item.purpose ||
      item.reason ||
      item.explanation ||
      ""
    ).trim();
  };

  const getArray = (...values) => {
    for (const value of values) {
      if (Array.isArray(value) && value.length > 0) {
        return value.map(asText).filter(Boolean);
      }
    }

    return [];
  };

  // =========================================
  // PROJECT NAME
  // =========================================

  const projectName =
    repositoryAnalysis?.projectName ||
    repositoryAnalysis?.repository?.name ||
    "Repository";

  // =========================================
  // IMPORTANT FILES
  // =========================================

  const importantFiles = Array.isArray(
    repositoryAnalysis?.importantFiles
  )
    ? repositoryAnalysis.importantFiles
    : [];

  // =========================================
  // HEALTH SCORE
  // =========================================

  const rawScore =
    repositoryAnalysis?.score ??
    repositoryAnalysis?.healthScore ??
    repositoryAnalysis?.overallScore ??
    repositoryAnalysis?.projectHealth?.score ??
    null;

  const parsedScore =
    rawScore !== null &&
    rawScore !== undefined &&
    rawScore !== "" &&
    !Number.isNaN(Number(rawScore))
      ? Math.max(
          0,
          Math.min(100, Number(rawScore))
        )
      : null;

  // =========================================
  // PROJECT OVERVIEW
  // =========================================

  const projectOverview =
    repositoryAnalysis?.projectOverview ||
    repositoryAnalysis?.overview ||
    repositoryAnalysis?.summary ||
    repositoryAnalysis?.projectDescription ||
    "";

  // =========================================
  // WORKFLOW
  // =========================================

  const howTheProjectWorks = getArray(
    repositoryAnalysis?.howTheProjectWorks,
    repositoryAnalysis?.workflow,
    repositoryAnalysis?.applicationFlow
  );

  // =========================================
  // KEY STRENGTHS
  // =========================================

  let strengths = getArray(
    repositoryAnalysis?.keyStrengths,
    repositoryAnalysis?.strengths,
    repositoryAnalysis?.positiveFindings
  );

  /*
   * howTheProjectWorks contains workflow steps,
   * not strengths.
   *
   * So only use it to derive meaningful architectural
   * strengths when explicit strengths are unavailable.
   */

  if (strengths.length === 0) {
    const derivedStrengths = [];

    if (importantFiles.length > 0) {
      derivedStrengths.push(
        `The project has ${importantFiles.length} important files identified by Bob AI, indicating a defined application structure.`
      );
    }

    if (howTheProjectWorks.length > 0) {
      derivedStrengths.push(
        "The application follows a defined processing workflow from input handling through final results."
      );
    }

    const filePurposes = importantFiles
      .map((item) =>
        typeof item === "object"
          ? asText(item)
          : ""
      )
      .filter(Boolean);

    if (filePurposes.length > 0) {
      derivedStrengths.push(
        "Project responsibilities are separated across dedicated files and modules."
      );
    }

    strengths = derivedStrengths;
  }

  // =========================================
  // AREAS FOR IMPROVEMENT
  // =========================================

  const warnings = getArray(
    repositoryAnalysis?.potentialImportantNotes,
    repositoryAnalysis?.areasForImprovement,
    repositoryAnalysis?.improvements,
    repositoryAnalysis?.warnings
  );

  // =========================================
  // METADATA
  // =========================================

  const fileCount =
    repositoryAnalysis?.repository?.metadata
      ?.fileCount ??
    repositoryAnalysis?.metadata?.fileCount ??
    0;

  const sourceFileCount =
    repositoryAnalysis?.repository?.metadata
      ?.sourceFileCount ??
    repositoryAnalysis?.metadata
      ?.sourceFileCount ??
    0;

  const sourceBytes =
    repositoryAnalysis?.repository?.metadata
      ?.sourceBytes ??
    repositoryAnalysis?.metadata?.sourceBytes ??
    0;

  const sourceSize =
    sourceBytes > 0
      ? sourceBytes >= 1024 * 1024
        ? `${(
            sourceBytes /
            (1024 * 1024)
          ).toFixed(1)} MB`
        : `${Math.round(
            sourceBytes / 1024
          )} KB`
      : "—";

  // =========================================
  // METRICS
  // =========================================

  const metrics = [
    {
      name: "Files scanned",
      value: fileCount || "—",
      percentage:
        fileCount > 0
          ? Math.min(
              100,
              Math.max(
                15,
                fileCount * 3
              )
            )
          : 0,
    },

    {
      name: "Source files",
      value: sourceFileCount || "—",
      percentage:
        sourceFileCount > 0
          ? Math.min(
              100,
              Math.max(
                15,
                sourceFileCount * 5
              )
            )
          : 0,
    },

    {
      name: "Source size",
      value: sourceSize,
      percentage:
        sourceBytes > 0
          ? Math.min(
              100,
              Math.max(
                15,
                (sourceBytes /
                  (1024 * 1024)) *
                  20
              )
            )
          : 0,
    },

    {
      name: "Important files",
      value:
        importantFiles.length > 0
          ? importantFiles.length
          : "—",
      percentage:
        importantFiles.length > 0
          ? Math.min(
              100,
              Math.max(
                15,
                importantFiles.length * 10
              )
            )
          : 0,
    },
  ];

  // =========================================
  // HEALTH DESCRIPTION
  // =========================================

  const getHealthText = () => {
    if (projectOverview) {
      return projectOverview;
    }

    if (
      strengths.length > 0 &&
      warnings.length > 0
    ) {
      return `Bob AI identified ${strengths.length} positive findings and ${warnings.length} areas for improvement in ${projectName}.`;
    }

    if (strengths.length > 0) {
      return `Bob AI identified ${strengths.length} positive findings in ${projectName}.`;
    }

    if (warnings.length > 0) {
      return `Bob AI identified ${warnings.length} areas that could be improved in ${projectName}.`;
    }

    return `The repository has been analyzed using the available source and project information.`;
  };

  {/* =========================================
    HOW THE PROJECT WORKS
    ========================================= */}

    <section className="analysis-card file-analysis">

      <div className="analysis-card-heading">

        <div className="analysis-heading-icon">
          ⇢
        </div>

        <div>

          <h2>
            How the Project Works
          </h2>

          <p>
            Application workflow identified by Bob AI
          </p>

        </div>

      </div>


      <div className="finding-list">

        {howTheProjectWorks.length > 0 ? (

          howTheProjectWorks.map(
            (item, index) => (

              <div
                className="finding-item"
                key={index}
              >

                <div className="finding-check">
                  {index + 1}
                </div>

                <p>
                  {item}
                </p>

              </div>

            )
          )

        ) : (

          <div className="finding-empty">
            No application workflow information was
            returned by Bob AI.
          </div>

        )}

      </div>

    </section>

  // =========================================
  // FILE ANALYSIS
  // =========================================

  const files = importantFiles.map(
    (item) => {
      if (typeof item === "string") {
        return {
          file: item,
          type: "Important file",
          score: null,
          status: "Analyzed",
        };
      }

      return {
        file:
          item?.path ||
          item?.file ||
          item?.name ||
          "Repository file",

        type:
          item?.type ||
          item?.purpose ||
          "Important file",

        score:
          item?.score ??
          item?.quality ??
          item?.qualityScore ??
          null,

        status:
          item?.status ||
          "Analyzed",
      };
    }
  );

  // =========================================
  // RECOMMENDATION
  // =========================================

  const recommendation =
    repositoryAnalysis?.recommendation ||
    repositoryAnalysis?.aiRecommendation ||
    repositoryAnalysis?.overallAssessment ||
    "";

  let recommendationText =
    typeof recommendation === "string"
      ? recommendation.trim()
      : asText(recommendation);

  if (!recommendationText) {
    if (warnings.length > 0) {
      recommendationText =
        `The project has a workable foundation. The main focus should be on addressing the ${warnings.length} identified improvement area${
          warnings.length === 1
            ? ""
            : "s"
        } while maintaining the strengths already identified by Bob AI.`;
    } else if (strengths.length > 0) {
      recommendationText =
        "The project has a solid foundation based on the analyzed repository structure. The existing strengths should be maintained while continuing to improve documentation, testing, and maintainability where applicable.";
    } else {
      recommendationText =
        "Bob AI did not provide a specific recommendation for this repository.";
    }
  }

  // =========================================
  // BUTTON HANDLER
  // =========================================

  const handleReAnalyze = () => {
    onBack();
  };

  return (
    <div className="detailed-analysis-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="analysis-header">

        <button
          className="analysis-back-button"
          type="button"
          onClick={onBack}
        >
          ← Back to Project Overview
        </button>

        <div className="analysis-brand">

          <div className="analysis-brand-icon">
            ◇
          </div>

          <span>Cortex</span>

        </div>

      </header>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="analysis-main">

        {/* =========================================
            TITLE
        ========================================= */}

        <section className="analysis-title">

          <div>

            <h1>
              𝑫𝒆𝒕𝒂𝒊𝒍𝒆𝒅 𝑨𝑰 𝑨𝒏𝒂𝒍𝒚𝒔𝒊𝒔
            </h1>

            <p className="analysis-project-name">
              AI-generated analysis for{" "}
              <strong>
                {projectName}
              </strong>
            </p>

          </div>

          <div className="analysis-actions">

            <button
              type="button"
              className="reanalyze-button"
              onClick={handleReAnalyze}
            >
              ↻ Re-analyze Repository
            </button>

          </div>

        </section>


        {/* =========================================
            SCORE
        ========================================= */}

        <section className="analysis-score-card">

          <div className="score-circle">

            <strong>
              {parsedScore !== null
                ? parsedScore
                : "AI"}
            </strong>

            <span>
              {parsedScore !== null
                ? "/ 100"
                : "Analysis"}
            </span>

          </div>


          <div className="score-content">

            <h2>
              Overall Project Health
            </h2>

            <p>
              {getHealthText()}
            </p>

            <div className="score-progress">

              <div
                className="score-progress-fill"
                style={{
                  width:
                    parsedScore !== null
                      ? `${parsedScore}%`
                      : "0%",
                }}
              />

            </div>

          </div>

        </section>


        {/* =========================================
            METRICS
        ========================================= */}

        <section className="analysis-metrics">

          {metrics.map(
            (metric, index) => (

              <div
                className="analysis-metric-card"
                key={index}
              >

                <span>
                  {metric.name}
                </span>

                <strong>
                  {metric.value}
                </strong>

                <div className="metric-bar">

                  <div
                    style={{
                      width: `${metric.percentage}%`,
                    }}
                  />

                </div>

              </div>

            )
          )}

        </section>


        {/* =========================================
            FINDINGS GRID
        ========================================= */}

        <section className="analysis-grid">

          {/* =====================================
              STRENGTHS
          ===================================== */}

          <div className="analysis-card">

            <div className="analysis-card-heading">

              <div className="analysis-heading-icon success">
                ✓
              </div>

              <div>

                <h2>
                  Key Strengths
                </h2>

                <p>
                  Positive findings from Bob AI
                </p>

              </div>

            </div>


            <div className="finding-list">

              {strengths.length > 0 ? (

                strengths.map(
                  (item, index) => (

                    <div
                      className="finding-item"
                      key={index}
                    >

                      <div className="finding-check">
                        ✓
                      </div>

                      <p>
                        {item}
                      </p>

                    </div>

                  )
                )

              ) : (

                <div className="finding-empty">
                  No specific strengths were
                  returned by Bob AI.
                </div>

              )}

            </div>

          </div>


          {/* =====================================
              WARNINGS
          ===================================== */}

          <div className="analysis-card">

            <div className="analysis-card-heading">

              <div className="analysis-heading-icon warning">
                !
              </div>

              <div>

                <h2>
                  Areas for Improvement
                </h2>

                <p>
                  Suggestions generated by Bob AI
                </p>

              </div>

            </div>


            <div className="finding-list">

              {warnings.length > 0 ? (

                warnings.map(
                  (item, index) => (

                    <div
                      className="finding-item"
                      key={index}
                    >

                      <div className="finding-warning">
                        !
                      </div>

                      <p>
                        {item}
                      </p>

                    </div>

                  )
                )

              ) : (

                <div className="finding-empty">
                  No specific improvement areas
                  were returned by Bob AI.
                </div>

              )}

            </div>

          </div>

        </section>


        {/* =========================================
            FILE ANALYSIS
        ========================================= */}

        <section className="analysis-card file-analysis">

          <div className="analysis-card-heading">

            <div className="analysis-heading-icon">
              ◫
            </div>

            <div>

              <h2>
                File Analysis
              </h2>

              <p>
                AI analysis of important project files
              </p>

            </div>

          </div>


          <div className="file-table">

            <div className="file-table-header">

              <span>
                File
              </span>

              <span>
                Type
              </span>

              <span>
                Quality
              </span>

              <span>
                Status
              </span>

            </div>


            {files.length > 0 ? (

              files.map(
                (file, index) => {

                  const fileScore =
                    file.score !== null &&
                    file.score !== undefined &&
                    !Number.isNaN(
                      Number(file.score)
                    )
                      ? Math.max(
                          0,
                          Math.min(
                            100,
                            Number(file.score)
                          )
                        )
                      : null;

                  return (

                    <div
                      className="file-table-row"
                      key={index}
                    >

                      <span>
                        {file.file}
                      </span>

                      <span>
                        {file.type}
                      </span>

                      <div className="file-score">

                        <span>
                          {fileScore !== null
                            ? fileScore
                            : "—"}
                        </span>

                        <div>

                          <div
                            style={{
                              width:
                                fileScore !== null
                                  ? `${fileScore}%`
                                  : "0%",
                            }}
                          />

                        </div>

                      </div>

                      <span className="file-status">
                        ✓ {file.status}
                      </span>

                    </div>

                  );
                }
              )

            ) : (

              <div className="finding-empty">
                No important files were identified
                in the repository analysis.
              </div>

            )}

          </div>

        </section>


        {/* =========================================
            AI RECOMMENDATION
        ========================================= */}

        <section className="recommendation-card">

          <div className="recommendation-icon">
            ✦
          </div>

          <div>

            <h2>
              Bob AI Recommendation
            </h2>

            <p>
              {recommendationText}
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DetailedAnalysis;