import "./DetailedAnalysis.css";

function DetailedAnalysis({ onBack, analysis: repositoryAnalysis }) {
  const asText = (item) =>
    typeof item === "string"
      ? item
      : item?.text ||
        item?.description ||
        item?.note ||
        item?.purpose ||
        "Not found in the repository.";

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
    !Number.isNaN(Number(rawScore))
      ? Math.max(0, Math.min(100, Number(rawScore)))
      : null;

  const getHealthText = () => {
    if (parsedScore === null) {
      return "Overall project health based on the available AI analysis.";
    }

    if (parsedScore >= 80) {
      return "The repository has a strong structure and good overall project quality.";
    }

    if (parsedScore >= 60) {
      return "The repository has a solid foundation with some areas that can be improved.";
    }

    if (parsedScore >= 40) {
      return "The repository is functional but several areas could benefit from improvement.";
    }

    return "The analysis identified several areas that should be improved for better project quality.";
  };

  // =========================================
  // METRIC VALUES
  // =========================================

  const fileCount =
    repositoryAnalysis?.repository?.metadata?.fileCount ??
    repositoryAnalysis?.metadata?.fileCount ??
    0;

  const sourceFileCount =
    repositoryAnalysis?.repository?.metadata?.sourceFileCount ??
    repositoryAnalysis?.metadata?.sourceFileCount ??
    0;

  const sourceBytes =
    repositoryAnalysis?.repository?.metadata?.sourceBytes ??
    repositoryAnalysis?.metadata?.sourceBytes ??
    0;

  const sourceSize =
    sourceBytes > 0
      ? sourceBytes >= 1024 * 1024
        ? `${(sourceBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(sourceBytes / 1024)} KB`
      : "—";

  const metrics = [
    {
      name: "Files scanned",
      value: fileCount || "—",
      percentage:
        fileCount > 0
          ? Math.min(100, Math.max(15, fileCount / 2))
          : 0,
    },
    {
      name: "Source files",
      value: sourceFileCount || "—",
      percentage:
        sourceFileCount > 0
          ? Math.min(100, Math.max(15, sourceFileCount / 2))
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
                (sourceBytes / (1024 * 1024)) * 20
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
              Math.max(15, importantFiles.length * 10)
            )
          : 0,
    },
  ];

  // =========================================
  // FINDINGS
  // =========================================

  const strengths = Array.isArray(
    repositoryAnalysis?.howTheProjectWorks
  )
    ? repositoryAnalysis.howTheProjectWorks
        .map(asText)
        .filter(Boolean)
    : [];

  const warnings = Array.isArray(
    repositoryAnalysis?.potentialImportantNotes
  )
    ? repositoryAnalysis.potentialImportantNotes
        .map(asText)
        .filter(Boolean)
    : [];

  // =========================================
  // FILE ANALYSIS
  // =========================================

  const files = importantFiles.map((item) => {
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
  });

  // =========================================
  // RECOMMENDATION
  // =========================================

  const recommendation =
    repositoryAnalysis?.recommendation ||
    repositoryAnalysis?.recommendations ||
    repositoryAnalysis?.summary ||
    repositoryAnalysis?.overallAssessment ||
    null;

  const recommendationText =
    typeof recommendation === "string"
      ? recommendation
      : recommendation?.text ||
        recommendation?.description ||
        recommendation?.note ||
        "The analysis provides a useful overview of the repository structure, important files, strengths, and areas that can be improved.";

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
              {repositoryAnalysis?.projectName ||
                repositoryAnalysis?.repository?.name ||
                "Repository"}
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
                : "—"}
            </strong>

            <span>
              / 100
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

          {metrics.map((metric, index) => (

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

          ))}

        </section>


        {/* =========================================
            FINDINGS GRID
        ========================================= */}

        <section className="analysis-grid">

          {/* STRENGTHS */}

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
                strengths.map((item, index) => (

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

                ))
              ) : (

                <div className="finding-empty">
                  No specific strengths were returned
                  by the analysis.
                </div>

              )}

            </div>

          </div>


          {/* WARNINGS */}

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
                warnings.map((item, index) => (

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

                ))
              ) : (

                <div className="finding-empty">
                  No specific improvement areas were
                  returned by the analysis.
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

              files.map((file, index) => {

                const fileScore =
                  file.score !== null &&
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
              })

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