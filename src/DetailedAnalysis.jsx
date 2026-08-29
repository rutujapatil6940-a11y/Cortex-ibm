
import "./DetailedAnalysis.css";

function DetailedAnalysis({ onBack }) {
  // =========================================
  // DUMMY AI ANALYSIS DATA
  // =========================================

  const analysis = {
    projectName: "Cortex AI Project",
    score: 87,

    metrics: [
      { name: "Code Quality", value: "87%", percentage: 87 },
      { name: "Maintainability", value: "82%", percentage: 82 },
      { name: "Security", value: "91%", percentage: 91 },
      { name: "Documentation", value: "76%", percentage: 76 },
    ],

    strengths: [
      "Repository structure is well organized.",
      "Authentication and dashboard modules are clearly separated.",
      "Components follow a reusable architecture.",
      "The project uses modern frontend technologies.",
    ],

    warnings: [
      "Some components could be optimized for better performance.",
      "Documentation coverage can be improved.",
      "Some repeated UI logic can be converted into reusable components.",
    ],

    files: [
      {
        file: "src/App.jsx",
        type: "React Component",
        score: 92,
        status: "Good",
      },
      {
        file: "src/Dashboard.jsx",
        type: "React Component",
        score: 88,
        status: "Good",
      },
      {
        file: "src/ProjectOverview.jsx",
        type: "React Component",
        score: 86,
        status: "Good",
      },
      {
        file: "src/App.css",
        type: "Stylesheet",
        score: 81,
        status: "Good",
      },
      {
        file: "src/DetailedAnalysis.jsx",
        type: "React Component",
        score: 89,
        status: "Good",
      },
    ],
  };

  // =========================================
  // BUTTON HANDLERS
  // =========================================

  const handleReAnalyze = () => {
    alert("Re-analysis will be connected to Bob AI backend later.");
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
          </div>


          {/* RIGHT SIDE:
              Analysis Complete + Re-analyze
          */}

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
              {analysis.score}
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
              Your repository has a strong overall structure
              with some areas that can be improved.
            </p>

            <div className="score-progress">

              <div
                className="score-progress-fill"
                style={{
                  width: `${analysis.score}%`,
                }}
              />

            </div>

          </div>

        </section>


        {/* =========================================
            METRICS
        ========================================= */}

        <section className="analysis-metrics">

          {analysis.metrics.map((metric, index) => (

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

              {analysis.strengths.map(
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

              {analysis.warnings.map(
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


            {analysis.files.map(
              (file, index) => (

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
                      {file.score}%
                    </span>

                    <div>

                      <div
                        style={{
                          width: `${file.score}%`,
                        }}
                      />

                    </div>

                  </div>

                  <span className="file-status">
                    ✓ {file.status}
                  </span>

                </div>

              )
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
              The project has a good foundation and a
              well-organized architecture. Focus on improving
              documentation, optimizing repeated components,
              and adding automated testing to further improve
              project quality and maintainability.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DetailedAnalysis;
