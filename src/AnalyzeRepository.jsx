import { useState } from "react";
import "./AnalyzeRepository.css";

function AnalyzeRepository({ onBack, onClone, onAnalyze, isAnalyzing }) {
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(null);
  const [stage, setStage] = useState(null);

  const handleAnalyze = async () => {
    const repositoryUrl = githubUrl.trim();
    setError("");
    setReady(null);
    setStage(null);
    if (!repositoryUrl) return setError("Please provide a GitHub repository URL.");
    if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(repositoryUrl)) return setError("Enter a valid HTTPS GitHub repository URL.");
    try {
      setStage("cloning");
      const workspace = await onClone(repositoryUrl);
      const analysisId = workspace.analysisId || workspace.analysis?.id;
      setReady({
        analysisId,
        message: "Repository ready.",
      });
      setStage("analyzing");
      const result = await onAnalyze(analysisId);
      setReady({
        analysisId: result.analysisId || result.analysis?.id || analysisId,
        message: result.message || "Repository analysis completed.",
      });
      setStage("completed");
    } catch (requestError) {
      setStage(null);
      setError(requestError.message || "Unable to analyze this repository.");
    }
  };

  const statusMessage = {
    cloning: "Cloning repository...",
    analyzing: "Repository ready. Analyzing repository...",
    completed: ready?.message || "Repository analysis completed.",
  }[stage];

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
        {statusMessage && <div className={`workspace-ready-message ${stage === "completed" ? "" : "workspace-progress-message"}`} role="status"><span className="workspace-ready-icon">{stage === "completed" ? "✓" : "…"}</span><span><strong>{statusMessage}</strong>{ready?.analysisId && <><br />Analysis ID: {ready.analysisId}</>}</span></div>}
        <div className="analyze-actions"><button type="button" className="cancel-button" onClick={onBack} disabled={isAnalyzing}>Cancel</button><button type="button" className="analyze-repository-button" onClick={handleAnalyze} disabled={isAnalyzing}><span>✦</span><span>{stage === "cloning" || (isAnalyzing && !stage) ? "Cloning repository..." : stage === "analyzing" ? "Analyzing repository..." : "Analyze Repository"}</span></button></div>
      </section>
      <section className="analyze-info"><div className="info-icon">✦</div><div className="info-content"><h3>What happens next?</h3><p>Cortex clones the repository into temporary server storage and verifies it is ready for later analysis.</p></div></section>
    </main>
  </div>;
}

export default AnalyzeRepository;
