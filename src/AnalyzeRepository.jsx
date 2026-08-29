
import { useRef, useState } from "react";
import "./AnalyzeRepository.css";

function AnalyzeRepository({ onBack, onAnalyze }) {
  const fileInputRef = useRef(null);

  const [githubUrl, setGithubUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // VALIDATE ZIP FILE
  // =====================================================

  const validateFile = (file) => {
    if (!file) return false;

    setError("");

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setSelectedFile(null);
      setError("Please select a valid .ZIP file.");
      return false;
    }

    if (file.size > 100 * 1024 * 1024) {
      setSelectedFile(null);
      setError("File size must be less than 100 MB.");
      return false;
    }

    setSelectedFile(file);
    setGithubUrl("");

    return true;
  };

  // =====================================================
  // CHOOSE FILE
  // =====================================================

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      validateFile(file);
    }
  };

  // =====================================================
  // DRAG OVER
  // =====================================================

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // =====================================================
  // DROP FILE
  // =====================================================

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      validateFile(file);
    }
  };

  // =====================================================
  // REMOVE FILE
  // =====================================================

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // GITHUB URL CHANGE
  // =====================================================

  const handleGithubChange = (event) => {
    const value = event.target.value;

    setGithubUrl(value);
    setError("");

    if (value.trim()) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =====================================================
  // ANALYZE REPOSITORY
  // =====================================================

  const handleAnalyze = () => {
    setError("");

    const url = githubUrl.trim();

    // Nothing provided
    if (!url && !selectedFile) {
      setError(
        "Please provide a GitHub repository URL or upload a ZIP file."
      );
      return;
    }

    // GitHub URL validation
    if (url) {
      const githubPattern =
        /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/;

      if (!githubPattern.test(url)) {
        setError("Please enter a valid GitHub repository URL.");
        return;
      }
    }

    // Start analysis
    if (onAnalyze) {
      onAnalyze();
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleGithubKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAnalyze();
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="analyze-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="analyze-header">

        <button
          type="button"
          className="back-dashboard"
          onClick={onBack}
        >
          <span className="back-arrow">←</span>
          <span>Back to Dashboard</span>
        </button>

        <div className="analyze-brand">

          <div className="analyze-brand-icon">
            ◇
          </div>

          <span>Cortex</span>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="analyze-main">

        {/* PAGE TITLE */}

        <section className="analyze-title">

          <h1>
            𝑨𝒏𝒂𝒍𝒚𝒛𝒆 𝑹𝒆𝒑𝒐𝒔𝒊𝒕𝒐𝒓𝒚
          </h1>

        </section>

        {/* =================================================
            REPOSITORY CARD
        ================================================= */}

        <section className="repository-upload-card">

          {/* CARD HEADER */}

          <div className="upload-card-header">

            <div className="upload-icon">
              ◈
            </div>

            <div className="upload-card-heading-text">

              <h2>
                Connect Repository
              </h2>

              <p>
                Choose how you want to provide your codebase
              </p>

            </div>

          </div>

          {/* =================================================
              GITHUB SECTION
          ================================================= */}

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
              type="url"
              value={githubUrl}
              onChange={handleGithubChange}
              onKeyDown={handleGithubKeyDown}
              placeholder="https://github.com/username/repository"
              className="github-input"
              autoComplete="off"
            />

            
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="error-message"
              role="alert"
            >
              <span className="error-icon">
                ⚠
              </span>

              <span>
                {error}
              </span>
            </div>
          )}

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

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
              <span>✦</span>

              <span>
                Analyze Repository
              </span>

            </button>

          </div>

        </section>

        {/* =================================================
            INFORMATION CARD
        ================================================= */}

        <section className="analyze-info">

          <div className="info-icon">
            ✦
          </div>

          <div className="info-content">

            <h3>
              What happens next?
            </h3>

            <p>
              Bob AI will analyze your repository structure,
              technologies, modules and code to generate
              project insights and documentation.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AnalyzeRepository;
