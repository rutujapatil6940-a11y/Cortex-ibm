import "./CodeStructure.css";

function CodeStructure({ onBack }) {
  return (
    <div className="code-structure-page">

      <header className="code-structure-header">
        <button
          className="code-back-button"
          onClick={onBack}
        >
          ← Back 
        </button>

        <div className="code-brand">
          <div className="code-brand-icon">◇</div>
          <span>Cortex</span>
        </div>

        
      </header>

      <main className="code-structure-main">

        <section className="code-title-section">
          <div>
           
            <h1>𝑪𝒐𝒅𝒆 𝑺𝒕𝒓𝒖𝒄𝒕𝒖𝒓𝒆</h1>

          </div>

          <div className="code-analysis-status">
            <span></span>
            Analysis Complete
          </div>
        </section>

        <section className="code-project-card">
          <div className="code-project-icon">
            ◈
          </div>

          <div>
            <h2>Cortex AI Project</h2>
            <p>
              AI-powered code intelligence and automated documentation system.
            </p>
          </div>
        </section>

        <section className="code-content-grid">

          <div className="code-tree-card">

            <div className="code-card-heading">
              <div className="code-heading-icon">◫</div>

              <div>
                <h2>Project File Structure</h2>
                <p>Detected repository structure</p>
              </div>
            </div>

            <div className="file-tree">

              <div className="tree-folder">
                <span className="tree-arrow">▼</span>
                <span className="folder-icon">📁</span>
                <span>src</span>
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">⚛</span>
                App.jsx
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">⚛</span>
                Dashboard.jsx
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">⚛</span>
                AnalyzeRepository.jsx
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">⚛</span>
                ProjectOverview.jsx
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">⚛</span>
                DetailedAnalysis.jsx
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">⚛</span>
                Documentation.jsx
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">⚛</span>
                CodeStructure.jsx
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">🎨</span>
                App.css
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">🎨</span>
                CodeStructure.css
              </div>

              <div className="tree-file nested-file">
                <span className="file-icon">🎨</span>
                ProjectOverview.css
              </div>

            </div>
          </div>


          <div className="code-summary-card">

            <div className="code-card-heading">
              <div className="code-heading-icon">✦</div>

              <div>
                <h2>Structure Summary</h2>
                <p>AI-generated architecture overview</p>
              </div>
            </div>

            <div className="structure-stat">
              <span>Total Files</span>
              <strong>128</strong>
            </div>

            <div className="structure-stat">
              <span>React Components</span>
              <strong>24</strong>
            </div>

            <div className="structure-stat">
              <span>Stylesheets</span>
              <strong>18</strong>
            </div>

            <div className="structure-stat">
              <span>Modules</span>
              <strong>12</strong>
            </div>

            <div className="ai-structure-insight">

              <div className="insight-icon">
                ✦
              </div>

              <div>
                <h3>Bob AI Insight</h3>

                <p>
                  The project follows a component-based React
                  architecture. UI components and styles are
                  separated into individual files, making the
                  project easier to maintain and extend.
                </p>
              </div>

            </div>

          </div>

        </section>


        <section className="file-details-card">

          <div className="code-card-heading">
            <div className="code-heading-icon">
              ◈
            </div>

            <div>
              <h2>Architecture Overview</h2>
              <p>
                AI-detected application architecture
              </p>
            </div>
          </div>

          <div className="architecture-grid">

            <div className="architecture-item">
              <div className="architecture-icon">⚛</div>

              <div>
                <strong>React Frontend</strong>
                <p>
                  Component-based frontend architecture
                  using React and Vite.
                </p>
              </div>
            </div>

            <div className="architecture-item">
              <div className="architecture-icon">◇</div>

              <div>
                <strong>Application State</strong>
                <p>
                  React state controls navigation and
                  screen transitions.
                </p>
              </div>
            </div>

            <div className="architecture-item">
              <div className="architecture-icon">🎨</div>

              <div>
                <strong>CSS Styling</strong>
                <p>
                  Dedicated CSS files provide reusable
                  page-level styling.
                </p>
              </div>
            </div>

            <div className="architecture-item">
              <div className="architecture-icon">✦</div>

              <div>
                <strong>AI Intelligence</strong>
                <p>
                  Bob AI analyzes project structure and
                  generates insights.
                </p>
              </div>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CodeStructure;