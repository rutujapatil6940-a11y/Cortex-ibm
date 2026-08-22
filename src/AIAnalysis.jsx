import "./AIAnalysis.css";

function AIAnalysis({ onBack }) {
  const analysis = {
    codeQuality: 87,
    security: 92,
    performance: 81,
    maintainability: 89,

    findings: [
      {
        type: "success",
        text: "Project structure is well organized."
      },
      {
        type: "success",
        text: "Authentication modules are clearly separated."
      },
      {
        type: "warning",
        text: "Some components can be optimized for better performance."
      },
      {
        type: "warning",
        text: "Some error handling cases are missing."
      }
    ],

    recommendations: [
      "Improve error handling across components.",
      "Reduce unnecessary component complexity.",
      "Add automated unit testing.",
      "Optimize large JavaScript components."
    ]
  };

  return (
    <div className="ai-analysis-page">

      {/* HEADER */}

      <header className="analysis-header">

        <button
          className="analysis-back-button"
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

        <div className="analysis-ai-badge">
          ✦ Bob AI
        </div>

      </header>


      {/* MAIN */}

      <main className="analysis-main">

        {/* TITLE */}

        <section className="analysis-title">

          <span className="analysis-label">
            AI CODE INTELLIGENCE
          </span>

          <h1>
            AI Code Analysis
          </h1>

          <p>
            Detailed AI-generated analysis of your repository
          </p>

        </section>


        {/* SCORE CARDS */}

        <section className="analysis-score-grid">

          <div className="analysis-score-card">

            <div className="score-icon">
              ◈
            </div>

            <span>
              Code Quality
            </span>

            <strong>
              {analysis.codeQuality}%
            </strong>

            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${analysis.codeQuality}%`
                }}
              />
            </div>

          </div>


          <div className="analysis-score-card">

            <div className="score-icon">
              ◉
            </div>

            <span>
              Security
            </span>

            <strong>
              {analysis.security}%
            </strong>

            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${analysis.security}%`
                }}
              />
            </div>

          </div>


          <div className="analysis-score-card">

            <div className="score-icon">
              ⚡
            </div>

            <span>
              Performance
            </span>

            <strong>
              {analysis.performance}%
            </strong>

            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${analysis.performance}%`
                }}
              />
            </div>

          </div>


          <div className="analysis-score-card">

            <div className="score-icon">
              ✦
            </div>

            <span>
              Maintainability
            </span>

            <strong>
              {analysis.maintainability}%
            </strong>

            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${analysis.maintainability}%`
                }}
              />
            </div>

          </div>

        </section>


        {/* CONTENT GRID */}

        <section className="analysis-content-grid">


          {/* AI FINDINGS */}

          <div className="analysis-card">

            <div className="analysis-card-heading">

              <div className="card-heading-icon">
                ✦
              </div>

              <div>

                <h2>
                  AI Findings
                </h2>

                <p>
                  What Bob AI discovered
                </p>

              </div>

            </div>


            <div className="finding-list">

              {analysis.findings.map(
                (finding, index) => (

                  <div
                    className="finding-item"
                    key={index}
                  >

                    <div
                      className={
                        finding.type === "success"
                          ? "finding-success"
                          : "finding-warning"
                      }
                    >
                      {finding.type === "success"
                        ? "✓"
                        : "!"}
                    </div>

                    <p>
                      {finding.text}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>


          {/* RECOMMENDATIONS */}

          <div className="analysis-card">

            <div className="analysis-card-heading">

              <div className="card-heading-icon">
                💡
              </div>

              <div>

                <h2>
                  AI Recommendations
                </h2>

                <p>
                  Suggested improvements
                </p>

              </div>

            </div>


            <div className="recommendation-list">

              {analysis.recommendations.map(
                (recommendation, index) => (

                  <div
                    className="recommendation-item"
                    key={index}
                  >

                    <span>
                      {index + 1}
                    </span>

                    <p>
                      {recommendation}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </section>


        {/* OVERALL ANALYSIS */}

        <section className="overall-analysis">

          <div className="overall-icon">
            ✦
          </div>

          <div>

            <h2>
              Overall AI Assessment
            </h2>

            <p>
              The repository has a strong overall structure
              and good maintainability. Bob AI recommends
              improving error handling, testing coverage and
              performance optimization to make the codebase
              more production-ready.
            </p>

          </div>

          <div className="overall-score">
            87%
            <span>
              Overall
            </span>
          </div>

        </section>

      </main>

    </div>
  );
}

export default AIAnalysis;