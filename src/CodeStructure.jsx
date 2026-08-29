import "./CodeStructure.css";

function CodeStructure({ onBack, analysis }) {
  const structure = Array.isArray(analysis?.projectStructure) ? analysis.projectStructure : [];
  const importantFiles = Array.isArray(analysis?.importantFiles) ? analysis.importantFiles : [];
  const toText = (item) => typeof item === "string" ? item : item?.path || item?.file || item?.name || "Repository item";
  const fileDetails = importantFiles.map((item) => ({
    path: toText(item),
    purpose: typeof item === "string" ? "No file detail was returned." : item?.purpose || item?.importantLogic || "No file detail was returned.",
  }));

  return <div className="code-structure-page">
    <header className="code-structure-header">
      <button className="code-back-button" type="button" onClick={onBack}>← Back</button>
      <div className="code-brand"><div className="code-brand-icon">◇</div><span>Cortex</span></div>
    </header>
    <main className="code-structure-main">
      <section className="code-title-section"><div><h1>𝑪𝒐𝒅𝒆 𝑺𝒕𝒓𝒖𝒄𝒕𝒖𝒓𝒆</h1></div><div className="code-analysis-status"><span></span>Analysis Complete</div></section>
      <section className="code-project-card"><div className="code-project-icon">◈</div><div><h2>{analysis?.repository?.name || "Repository"}</h2><p>{analysis?.projectOverview || "No overview was returned for this repository."}</p></div></section>
      <section className="code-content-grid">
        <div className="code-tree-card"><div className="code-card-heading"><div className="code-heading-icon">◫</div><div><h2>Project File Structure</h2><p>Structure returned by Bob from the cloned repository</p></div></div><div className="file-tree">{structure.length ? structure.map((item, index) => <div className="tree-file" key={`${toText(item)}-${index}`}><span className="file-icon">◫</span>{toText(item)}</div>) : <p>No file structure was returned.</p>}</div></div>
        <div className="code-summary-card"><div className="code-card-heading"><div className="code-heading-icon">✦</div><div><h2>Structure Summary</h2><p>Actual scan metadata</p></div></div><div className="structure-stat"><span>Total Files</span><strong>{analysis?.repository?.metadata?.fileCount ?? "—"}</strong></div><div className="structure-stat"><span>Source Files</span><strong>{analysis?.repository?.metadata?.sourceFileCount ?? "—"}</strong></div><div className="structure-stat"><span>Source Size</span><strong>{analysis?.repository?.metadata?.sourceBytes ? `${Math.round(analysis.repository.metadata.sourceBytes / 1024)} KB` : "—"}</strong></div><div className="structure-stat"><span>Important Files</span><strong>{fileDetails.length}</strong></div></div>
      </section>
      <section className="file-details-card"><div className="code-card-heading"><div className="code-heading-icon">◈</div><div><h2>Important Files</h2><p>AI observations grounded in scanned repository files</p></div></div><div className="architecture-grid">{fileDetails.length ? fileDetails.map((file) => <div className="architecture-item" key={file.path}><div className="architecture-icon">◫</div><div><strong>{file.path}</strong><p>{file.purpose}</p></div></div>) : <p>No important files were returned.</p>}</div></section>
    </main>
  </div>;
}

export default CodeStructure;
