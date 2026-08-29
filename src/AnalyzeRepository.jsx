import { useState } from "react";
import "./AnalyzeRepository.css";

function AnalyzeRepository({ onBack, onAnalyze, isAnalyzing }) {
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const repositoryUrl = githubUrl.trim();
    setError("");
    if (!repositoryUrl) return setError("Please provide a GitHub repository URL.");
    if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(repositoryUrl)) return setError("Enter a valid HTTPS GitHub repository URL.");
    try {
      await onAnalyze(repositoryUrl);
    } catch (requestError) {
      setError(requestError.message || "Unable to analyze this repository.");
    }
  };

  return <div className="analyze-page">
    <header className="analyze-header">
      <button type="button" className="back-dashboard" onClick={onBack}><span className="back-arrow">←</span><span>Back to Dashboard</span></button>
      <div className="analyze-brand"><div className="analyze-brand-icon">◇</div><span>Cortex</span></div>
    </header>
    <main className="analyze-main">
      <section className="analyze-title"><h1>𝑨𝒏𝒂𝒍𝒚𝒛𝒆 𝑹𝒆𝒑𝒐𝒔𝒊𝒕𝒐𝒓𝒚</h1></section>
      <section className="repository-upload-card">
        <div className="upload-card-header"><div className="upload-icon">◈</div><div className="upload-card-heading-text"><h2>Connect GitHub Repository</h2><p>Provide a public GitHub repository URL to analyze its actual source files.</p></div></div>
        <div className="github-section">
          <div className="section-title"><span className="section-icon">🔗</span><div><h3>GitHub Repository</h3><p>HTTPS URLs in the form github.com/owner/repository are supported.</p></div></div>
          <label htmlFor="github-url">GitHub Repository URL</label>
          <input id="github-url" type="url" value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); handleAnalyze(); } }} placeholder="https://github.com/username/repository" className="github-input" autoComplete="off" disabled={isAnalyzing} />
        </div>
        {error && <div className="error-message" role="alert"><span className="error-icon">⚠</span><span>{error}</span></div>}
        <div className="analyze-actions"><button type="button" className="cancel-button" onClick={onBack} disabled={isAnalyzing}>Cancel</button><button type="button" className="analyze-repository-button" onClick={handleAnalyze} disabled={isAnalyzing}><span>✦</span><span>{isAnalyzing ? "Analyzing…" : "Analyze Repository"}</span></button></div>
      </section>
      <section className="analyze-info"><div className="info-icon">✦</div><div className="info-content"><h3>What happens next?</h3><p>Cortex clones the repository temporarily, reads eligible source files, sends their real contents to Bob AI, then saves and returns the generated analysis.</p></div></section>
    </main>
  </div>;
}

export default AnalyzeRepository;
