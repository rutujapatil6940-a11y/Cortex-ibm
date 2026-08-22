import { useRef, useState } from "react";
import "./AnalyzeRepository.css";

function AnalyzeRepository({ onBack, onAnalyze }) {
  const fileInputRef = useRef(null);

  const [githubUrl, setGithubUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // ZIP FILE VALIDATION
  // =========================

  const validateFile = (file) => {
    if (!file) {
      return false;
    }

    setError("");

    // Check ZIP
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setSelectedFile(null);
      setError("Please select a valid .ZIP file.");
      return false;
    }

    // Maximum 100 MB
    if (file.size > 100 * 1024 * 1024) {
      setSelectedFile(null);
      setError("File size must be less than 100 MB.");
      return false;
    }

    setSelectedFile(file);

    // Clear GitHub URL
    setGithubUrl("");

    return true;
  };

  // =========================
  // CHOOSE ZIP FILE
  // =========================

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    validateFile(file);
  };

  // =========================
  // DRAG OVER
  // =========================

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // =========================
  // DROP FILE
  // =========================

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    validateFile(file);
  };

  // =========================
  // REMOVE FILE
  // =========================

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // GITHUB URL CHANGE
  // =========================

  const handleGithubChange = (event) => {
    const value = event.target.value;

    setGithubUrl(value);
    setError("");

    // If GitHub URL is entered,
    // remove selected ZIP file
    if (value.trim()) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =========================
  // ANALYZE REPOSITORY
  // =========================

  const handleAnalyze = () => {
    setError("");

    // Nothing selected
    if (!githubUrl.trim() && !selectedFile) {
      setError(
        "Please provide a GitHub repository URL or upload a ZIP file."
      );
      return;
    }

    // =========================
    // GITHUB VALIDATION
    // =========================

    if (githubUrl.trim()) {
      const githubPattern =
  /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/;
        

      if (!githubPattern.test(githubUrl.trim())) {
        setError(
          "Please enter a valid GitHub repository URL."
        );
        return;
      }
    }

    // =========================
    // SUCCESS
    // =========================

    /*
      Abhi hum frontend demo bana rahe hain.
      Real GitHub analysis backend ke through baad mein hoga.

      onAnalyze() App.jsx ko call karega
      aur Project Overview screen open hogi.
    */

    if (onAnalyze) {
      onAnalyze();
    }
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="analyze-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="analyze-header">

        <button
          type="button"
          className="back-dashboard"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="analyze-brand">

          <div className="analyze-brand-icon">
            ◇
          </div>

          <span>Cortex</span>

        </div>

      </header>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="analyze-main">

        {/* =========================================
            TITLE
        ========================================= */}

        <div className="analyze-title">

          <span className="analyze-label">
            AI CODE INTELLIGENCE
          </span>

          <h1>
            Analyze Repository
          </h1>

          <p>
            Analyze your codebase with Bob AI
          </p>

        </div>


        {/* =========================================
            MAIN CARD
        ========================================= */}

        <div className="repository-upload-card">

          {/* =========================================
              CARD HEADER
          ========================================= */}

          <div className="upload-card-header">

            <div className="upload-icon">
              ◈
            </div>

            <div>

              <h2>
                Connect Repository
              </h2>

              <p>
                Choose how you want to provide your codebase
              </p>

            </div>

          </div>


          {/* =========================================
              GITHUB SECTION
          ========================================= */}

          <div className="github-section">

            <div className="section-title">

              <span className="section-icon">
                🔗
              </span>

              <div>

                <h3>
                  GitHub Repository
                </h3>

                <p>
                  Enter the URL of your GitHub repository
                </p>

              </div>

            </div>


            <label htmlFor="github-url">
              GitHub Repository URL
            </label>

            <input
              id="github-url"
              type="text"
              value={githubUrl}
              onChange={handleGithubChange}
              placeholder="https://github.com/username/repository"
              className="github-input"
            />

          </div>


          {/* =========================================
              OR DIVIDER
          ========================================= */}

          <div className="or-divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>


          {/* =========================================
              ZIP SECTION
          ========================================= */}

          <div className="zip-section">

            <div className="section-title">

              <span className="section-icon">
                ↑
              </span>

              <div>

                <h3>
                  Upload ZIP File
                </h3>

                <p>
                  Upload your project as a ZIP file
                </p>

              </div>

            </div>


            {/* HIDDEN INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,application/zip"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />


            {/* =====================================
                NO FILE SELECTED
            ===================================== */}

            {!selectedFile && (

              <div
                className="upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >

                <div className="upload-box-icon">
                  ↑
                </div>

                <h3>
                  Upload your repository
                </h3>

                <p>
                  Drag & drop your ZIP file here
                </p>

                <span className="upload-or">
                  or
                </span>

                <button
                  type="button"
                  className="choose-file-button"
                  onClick={handleChooseFile}
                >
                  Choose ZIP File
                </button>

                <small>
                  Maximum file size: 100 MB
                </small>

              </div>

            )}


            {/* =====================================
                FILE SELECTED
            ===================================== */}

            {selectedFile && (

              <div className="selected-file-box">

                <div className="selected-file-icon">
                  ZIP
                </div>

                <div className="selected-file-info">

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {(
                      selectedFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </span>

                </div>

                <button
                  type="button"
                  className="remove-file-button"
                  onClick={handleRemoveFile}
                >
                  ✕
                </button>

              </div>

            )}

          </div>


          {/* =========================================
              ERROR MESSAGE
          ========================================= */}

          {error && (

            <div className="error-message">
              ⚠ {error}
            </div>

          )}


          {/* =========================================
              ACTION BUTTONS
          ========================================= */}

          <div className="analyze-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onBack}
            >
              Cancel
            </button>


            <button
              type="button"
              className="analyze-repository-button"
              onClick={handleAnalyze}
            >
              ✦ Analyze Repository
            </button>

          </div>

        </div>


        {/* =========================================
            INFORMATION CARD
        ========================================= */}

        <div className="analyze-info">

          <div className="info-icon">
            ✦
          </div>

          <div>

            <h3>
              What happens next?
            </h3>

            <p>
              Bob AI will analyze your repository structure,
              technologies, modules and code to generate
              project insights and documentation.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AnalyzeRepository;