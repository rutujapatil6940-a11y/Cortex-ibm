
import "./Dependencies.css";

function Dependencies({ onBack, analysis }) {
  const dependencies = (Array.isArray(analysis?.importantDependencies) ? analysis.importantDependencies : [])
    .map((dependency) => ({
      name: typeof dependency === "string" ? dependency : dependency?.package || dependency?.name || "Dependency",
      version: typeof dependency === "object" ? dependency?.version || "Not specified" : "Not specified",
      type: typeof dependency === "object" ? dependency?.purpose || dependency?.usage || "Detected dependency" : "Detected dependency",
      status: "Detected",
    }));

  return (
    <div className="dependencies-page">

      <header className="dependencies-header">

        <button
          type="button"
          className="dependencies-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="dependencies-brand">
          <div className="dependencies-brand-icon">
            ◇
          </div>

          <span>Cortex</span>
        </div>

      </header>

      <main className="dependencies-main">

        <section className="dependencies-title">

          <div>
            <h1>𝑫𝒆𝒑𝒆𝒏𝒅𝒆𝒏𝒄𝒊𝒆𝒔</h1>

            
          </div>

          <div className="dependencies-status">
            <span></span>
            Analysis Complete
          </div>

        </section>

        <section className="dependencies-card">

          <div className="dependencies-card-heading">

            <div className="dependencies-heading-icon">
              ⬡
            </div>

            <div>
              <h2>Project Dependencies</h2>

              <p>
                Detected packages used by the application
              </p>
            </div>

          </div>

          <div className="dependencies-list">

            {dependencies.length ? dependencies.map((dependency, index) => (

              <div
                className="dependency-item"
                key={index}
              >

                <div className="dependency-icon">
                  #
                </div>

                <div className="dependency-info">

                  <strong>
                    {dependency.name}
                  </strong>

                  <span>
                    Version {dependency.version}
                  </span>

                </div>

                <span className="dependency-type">
                  {dependency.type}
                </span>

                <span className="dependency-status">
                  ● {dependency.status}
                </span>

              </div>

            )) : <p>No dependencies were returned by the repository analysis.</p>}

          </div>

        </section>

       

      </main>

    </div>
  );
}

export default Dependencies;
