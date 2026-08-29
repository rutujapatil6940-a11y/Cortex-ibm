
import React from "react";
import "./Dependencies.css";

function Dependencies({ onBack }) {
  const dependencies = [
    {
      name: "React",
      version: "^19.0.0",
      type: "Frontend",
      status: "Healthy",
    },
    {
      name: "React DOM",
      version: "^19.0.0",
      type: "Frontend",
      status: "Healthy",
    },
    {
      name: "Vite",
      version: "^7.0.0",
      type: "Build Tool",
      status: "Healthy",
    },
    {
      name: "Framer Motion",
      version: "^12.0.0",
      type: "UI / Animation",
      status: "Healthy",
    },
  ];

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

            {dependencies.map((dependency, index) => (

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

            ))}

          </div>

        </section>

       

      </main>

    </div>
  );
}

export default Dependencies;
