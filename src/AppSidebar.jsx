import "./AppSidebar.css";
import logo from "./logo.jpg";

const projectPages = new Set([
  "upload",
  "projects",
  "project-overview",
  "ai-analysis",
  "code-structure",
  "dependencies",
  "architecture",
]);

function AppSidebar({ page, onNavigate }) {
  const activePage = projectPages.has(page)
    ? "projects"
    : page === "bob"
    ? "bob"
    : page === "documentation" || page === "generate-documentation"
    ? "documentation"
    : "dashboard";

  const navigationItems = [
    { id: "dashboard", icon: "⌂", label: "Dashboard" },
    { id: "projects", icon: "▣", label: "Projects" },
    { id: "bob", icon: "✦", label: "Bob Chat" },
    { id: "documentation", icon: "▤", label: "Documentation" },
  ];

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-brand">
        <img src={logo} alt="Cortex Logo" className="app-sidebar-logo" />
        <span>Cortex</span>
      </div>

      <nav className="app-sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`app-sidebar-item${activePage === item.id ? " active" : ""}`}
            type="button"
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default AppSidebar;
