
import { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.jpg";

import BobChat from "./BobChat";
import Dashboard from "./Dashboard";
import AnalyzeRepository from "./AnalyzeRepository";
import ProjectOverview from "./ProjectOverview";
import AIAnalysis from "./AIAnalysis";
import CodeStructure from "./CodeStructure";
import Dependencies from "./Dependencies";
import DetailedAnalysis from "./DetailedAnalysis";
import Documentation from "./Documentation";
import GenerateDocumentation from "./GenerateDocumentation";

function App() {
  const [page, setPage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // IMPORTANT:
  // false = repository not analyzed yet
  // true = repository analyzed
  const [repositoryAnalyzed, setRepositoryAnalyzed] = useState(false);

  // =====================================================
  // USER DETAILS
  // =====================================================

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  // =====================================================
  // BROWSER HISTORY
  // =====================================================

  useEffect(() => {
    const handleBrowserNavigation = () => {
      const savedPage = window.history.state?.page;

      if (savedPage) {
        setPage(savedPage);
      }
    };

    window.addEventListener(
      "popstate",
      handleBrowserNavigation
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handleBrowserNavigation
      );
    };
  }, []);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = (newPage) => {
    setPage(newPage);

    window.history.pushState(
      { page: newPage },
      "",
      `#${newPage}`
    );
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setUser((previousUser) => ({
      name: previousUser.name || "Developer",
      email: email,
    }));

    setIsLoggedIn(true);
    setShowPassword(false);

    navigate("dashboard");
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setUser({
      name: username,
      email: email,
    });

    setIsLoggedIn(true);
    setShowPassword(false);

    alert("Registration successful! Welcome to Cortex.");

    navigate("dashboard");
  };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    alert(
      "Password reset link has been sent to your email!"
    );

    setPage("login");
    setShowPassword(false);

    window.history.pushState(
      { page: "login" },
      "",
      "#login"
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setIsLoggedIn(false);

    // Logout ke baad repository bhi reset
    setRepositoryAnalyzed(false);

    setPage("login");
    setShowPassword(false);

    window.history.pushState(
      { page: "login" },
      "",
      "#login"
    );
  };

  // =====================================================
  // DASHBOARD → ANALYZE REPOSITORY
  // =====================================================

  const handleAnalyzeRepository = () => {
    navigate("upload");
  };

  // =====================================================
  // ANALYZE REPOSITORY → PROJECT OVERVIEW
  // =====================================================

  const handleStartAnalysis = () => {
    // Repository successfully analyzed
    setRepositoryAnalyzed(true);

    // Go to Project Overview
    navigate("projects");
  };

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();

    if (!name || !email) {
      alert("Please fill all fields.");
      return;
    }

    setUser({
      name,
      email,
    });

    alert("Profile updated successfully!");

    navigate("profile");
  };

  // =====================================================
  // LOGGED-IN APPLICATION
  // =====================================================

  if (isLoggedIn) {
    switch (page) {

      // =================================================
      // DASHBOARD
      // =================================================

      case "dashboard":
        return (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onAnalyzeRepository={handleAnalyzeRepository}
            onNavigate={navigate}
          />
        );

      // =================================================
      // ANALYZE REPOSITORY
      // =================================================

      case "upload":
        return (
          <AnalyzeRepository
            onBack={() => navigate("dashboard")}
            onAnalyze={handleStartAnalysis}
          />
        );

      // =================================================
      // PROJECTS
      // =================================================

      case "projects":

        // -----------------------------------------------
        // Repository NOT analyzed
        // -----------------------------------------------

        if (!repositoryAnalyzed) {
          return (
            <AnalyzeRepository
              onBack={() => navigate("dashboard")}
              onAnalyze={handleStartAnalysis}
            />
          );
        }

        // -----------------------------------------------
        // Repository analyzed
        // -----------------------------------------------

        return (
          <ProjectOverview
            onBack={() => navigate("dashboard")}

            onDocumentation={() =>
              navigate("documentation")
            }

            onDetailedAnalysis={() =>
              navigate("detailed-analysis")
            }

            onCodeStructure={() =>
              navigate("code-structure")
            }

            onDependencies={() =>
              navigate("dependencies")
            }

            onAIAnalysis={() =>
              navigate("ai-analysis")
            }

            onBobChat={() =>
              navigate("bob")
            }
          />
        );

      // =================================================
      // AI ANALYSIS
      // =================================================

      case "ai-analysis":
        return (
          <AIAnalysis
            onBack={() => navigate("projects")}
          />
        );

      // =================================================
      // CODE STRUCTURE
      // =================================================

      case "code-structure":
        return (
          <CodeStructure
            onBack={() => navigate("projects")}
          />
        );

      // =================================================
      // DEPENDENCIES
      // =================================================

      case "dependencies":
        return (
          <Dependencies
            onBack={() => navigate("projects")}
          />
        );

      // =================================================
      // DETAILED ANALYSIS
      // =================================================

      case "detailed-analysis":
        return (
          <DetailedAnalysis
            onBack={() => navigate("projects")}
          />
        );

      // =================================================
      // DOCUMENTATION
      // =================================================

      case "documentation":

        // -----------------------------------------------
        // Repository NOT analyzed
        // -----------------------------------------------

        if (!repositoryAnalyzed) {
          return (
            <AnalyzeRepository
              onBack={() => navigate("dashboard")}
              onAnalyze={handleStartAnalysis}
            />
          );
        }

        // -----------------------------------------------
        // Repository analyzed
        // -----------------------------------------------

        return (
          <Documentation
            onBack={() => navigate("dashboard")}
            onGenerateDocumentation={() =>
              navigate("generate-documentation")
            }
          />
        );

      // =================================================
      // GENERATE DOCUMENTATION
      // =================================================

      case "generate-documentation":
        return (
          <GenerateDocumentation
            onBack={() => navigate("documentation")}
          />
        );

      // =================================================
      // BOB CHAT
      // =================================================

      case "bob":
        return (
          <BobChat
            onBack={() => navigate("dashboard")}
          />
        );

      // =================================================
      // ARCHITECTURE
      // =================================================

      case "architecture":
        return (
          <div className="temporary-page">
            <div className="temporary-card">

              <div className="temporary-icon">
                ◇
              </div>

              <h1>Architecture</h1>

              <p>
                Project architecture visualization will
                appear here.
              </p>

              <div className="mock-chat">
                <div className="mock-message bob-message">
                  Frontend → Backend → AI Engine → Database
                </div>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("projects")}
              >
                ← Back to Projects
              </button>

            </div>
          </div>
        );

      // =================================================
      // SETTINGS
      // =================================================

      case "settings":
        return (
          <div className="temporary-page">
            <div className="temporary-card">

              <div className="temporary-icon">
                ⚙
              </div>

              <h1>Settings</h1>

              <p>
                Manage your Cortex preferences.
              </p>

              <div className="settings-option">
                <span>Notifications</span>

                <input
                  type="checkbox"
                  defaultChecked
                />
              </div>

              <div className="settings-option">
                <span>Email updates</span>

                <input
                  type="checkbox"
                  defaultChecked
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  alert("Settings saved!")
                }
              >
                Save Settings
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("dashboard")}
              >
                ← Back to Dashboard
              </button>

            </div>
          </div>
        );

      // =================================================
      // PROFILE
      // =================================================

      case "profile":
        return (
          <div className="temporary-page">
            <div className="temporary-card">

              <div className="temporary-avatar">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "D"}
              </div>

              <h1>My Profile</h1>

              <p>
                <strong>
                  {user.name || "Developer"}
                </strong>
              </p>

              <p>
                {user.email || "developer@example.com"}
              </p>

              <button
                type="button"
                onClick={() => navigate("edit-profile")}
              >
                Edit Profile
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("dashboard")}
              >
                ← Back to Dashboard
              </button>

            </div>
          </div>
        );

      // =================================================
      // EDIT PROFILE
      // =================================================

      case "edit-profile":
        return (
          <div className="temporary-page">
            <div className="temporary-card">

              <div className="temporary-avatar">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "D"}
              </div>

              <h1>Edit Profile</h1>

              <p>
                Update your name and email address.
              </p>

              <form
                onSubmit={handleUpdateProfile}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  width: "100%",
                  marginTop: "15px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    textAlign: "left",
                  }}
                >

                  <label htmlFor="profile-name">
                    Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    defaultValue={user.name}
                    placeholder="Enter your name"
                    required
                  />

                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    textAlign: "left",
                  }}
                >

                  <label htmlFor="profile-email">
                    Email
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    defaultValue={user.email}
                    placeholder="Enter your email"
                    required
                  />

                </div>

                <button type="submit">
                  Save Changes
                </button>

              </form>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("profile")}
              >
                ← Back to Profile
              </button>

            </div>
          </div>
        );

      // =================================================
      // NOTIFICATIONS
      // =================================================

      case "notifications":
        return (
          <div className="temporary-page">
            <div className="temporary-card">

              <div className="temporary-icon">
                🔔
              </div>

              <h1>Notifications</h1>

              <p>
                No new notifications.
              </p>

              <button
                type="button"
                onClick={() => navigate("dashboard")}
              >
                ← Back to Dashboard
              </button>

            </div>
          </div>
        );

      // =================================================
      // DEFAULT
      // =================================================

      default:
        return (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onAnalyzeRepository={handleAnalyzeRepository}
            onNavigate={navigate}
          />
        );
    }
  }

  // =====================================================
  // AUTH MODE
  // =====================================================

  const authMode =
    page === "register"
      ? "register-mode"
      : page === "forgot"
      ? "forgot-mode"
      : "login-mode";

  return (
    <div className="auth-page">

      {/* BACKGROUND */}

      <div className="background-circle background-circle-one" />
      <div className="background-circle background-circle-two" />

      {/* AUTH WRAPPER */}

      <div className={`auth-wrapper ${authMode}`}>

        {/* =================================================
            LOGIN
        ================================================= */}

        <div className="form-box login-box">

          <form onSubmit={handleLogin}>

            <h2>Login</h2>

            <p className="description">
              Welcome back! Sign in to continue to Cortex.
            </p>

            <div className="input-box">

              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
              />

              <label>Email</label>

            </div>

            <div className="input-box password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />

              <label>Password</label>

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <div className="remember-row">

              <label className="remember-label">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

            </div>

            <button
              type="submit"
              className="auth-button"
            >
              <span>
                Login
              </span>

              <span className="button-arrow">
                →
              </span>
            </button>

            <div className="switch-text">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => {
                  setPage("register");
                  setShowPassword(false);
                }}
              >
                Register
              </button>

            </div>

          </form>

        </div>

        {/* =================================================
            REGISTER
        ================================================= */}

        <div className="form-box register-box">

          <form onSubmit={handleRegister}>

            <h2>Create Account</h2>

            <p className="description">
              Create your account and start using Cortex.
            </p>

            <div className="input-box">

              <input
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
              />

              <label>Username</label>

            </div>

            <div className="input-box">

              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
              />

              <label>Email</label>

            </div>

            <div className="input-box password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                required
              />

              <label>Password</label>

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <label className="terms-label">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the terms & conditions
              </span>

            </label>

            <button
              type="submit"
              className="auth-button"
            >

              <span>
                Register
              </span>

              <span className="button-arrow">
                →
              </span>

            </button>

            <div className="switch-text">

              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() => {
                  setPage("login");
                  setShowPassword(false);
                }}
              >
                Login
              </button>

            </div>

          </form>

        </div>

        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        <div className="form-box forgot-box">

          <form onSubmit={handleForgotPassword}>

            <button
              type="button"
              className="forgot-back"
              onClick={() => {
                setPage("login");
                setShowPassword(false);
              }}
            >
              ← Back to Login
            </button>

            <h2>Forgot Password?</h2>

            <p className="description">
              No worries. Enter your email address and
              we'll send you a link to reset your password.
            </p>

            <div className="input-box">

              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
              />

              <label>Email</label>

            </div>

            <button
              type="submit"
              className="auth-button"
            >

              <span>
                Send Reset Link
              </span>

              <span className="button-arrow">
                →
              </span>

            </button>

            <div className="switch-text">

              <span>
                Remember your password?
              </span>

              <button
                type="button"
                onClick={() => {
                  setPage("login");
                  setShowPassword(false);
                }}
              >
                Login
              </button>

            </div>

          </form>

        </div>

        {/* =================================================
            WELCOME PANEL
        ================================================= */}

        <div className="welcome-panel">

          <div className="topographic-lines" />

          <div className="topographic-lines topographic-lines-two" />

          <div className="welcome-glow" />

          <div className="floating-circle floating-circle-one" />
          <div className="floating-circle floating-circle-two" />
          <div className="floating-circle floating-circle-three" />

          <div className="plus-sign plus-one">
            +
          </div>

          <div className="plus-sign plus-two">
            +
          </div>

          <div className="plus-sign plus-three">
            +
          </div>

          {/* LOGIN WELCOME */}

          <div className="welcome-content login-welcome">

            <div className="brand">
              CORTEX
            </div>

            <h1>
              Welcome
              <br />
              Back<span>!</span>
            </h1>

            <p>
              Login to continue exploring your
              <br />
              AI-powered code intelligence platform.
            </p>

            <div className="welcome-line" />

          </div>

          {/* REGISTER WELCOME */}

          <div className="welcome-content register-welcome">

            <div className="brand">
              CORTEX
            </div>

            <h1>
              Welcome
              <br />
              developer<span>!</span>
            </h1>

            <p>
              Create your account and start
              <br />
              analyzing your code with Cortex.
            </p>

            <div className="welcome-line" />

          </div>

          {/* FORGOT WELCOME */}

          <div className="welcome-content forgot-welcome">

            <div className="brand">
              CORTEX
            </div>

            <h1>
              Reset
              <br />
              Password<span>!</span>
            </h1>

            <p>
              Don't worry. We'll help you
              <br />
              get back into your Cortex account.
            </p>

            <div className="welcome-line" />

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
