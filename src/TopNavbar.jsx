import "./TopNavbar.css";
import logo from "./logo.jpg";

function TopNavbar({ onBack }) {
  return (
    <header className="top-navbar">
      <button className="top-navbar-back" type="button" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="top-navbar-brand">
        <img src={logo} alt="CodeAtlas Logo" />
        <span>CodeAtlas</span>
      </div>
    </header>
  );
}

export default TopNavbar;
