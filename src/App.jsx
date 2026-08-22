import { useState } from "react";

import Topography from "./Topography";
import Dashboard from "./Dashboard";
import AnalyzeRepository from "./AnalyzeRepository";
import ProjectOverview from "./ProjectOverview";
import DetailedAnalysis from "./DetailedAnalysis";
import Documentation from "./Documentation";
import CodeStructure from "./CodeStructure";

import "./App.css";

function App() {

  // =====================================================
  // LOGIN STATE
  // =====================================================

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [showSignUp, setShowSignUp] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });


  // =====================================================
  // SCREEN STATE
  // =====================================================

  const [showAnalyze, setShowAnalyze] =
    useState(false);

  const [showProjectOverview, setShowProjectOverview] =
    useState(false);

  const [showDetailedAnalysis, setShowDetailedAnalysis] =
    useState(false);

  const [showDocumentation, setShowDocumentation] =
    useState(false);

  const [showCodeStructure, setShowCodeStructure] =
    useState(false);


  // =====================================================
  // LOGIN DATA
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // =====================================================
  // SIGN UP DATA
  // =====================================================

  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showSignupPassword, setShowSignupPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // =====================================================
  // EMAIL REGEX
  // =====================================================

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  // =====================================================
  // LOGIN
  // =====================================================

  const handleSignIn = () => {

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    sessionStorage.setItem(
      "isLoggedIn",
      "true"
    );

    setIsLoggedIn(true);

    setShowAnalyze(false);
    setShowProjectOverview(false);
    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
    setShowCodeStructure(false);
  };


  // =====================================================
  // SIGN UP
  // =====================================================

  const handleSignUp = () => {

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!signupEmail.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(signupEmail.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!signupPassword) {
      alert("Please create a password.");
      return;
    }

    if (signupPassword.length < 8) {
      alert(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      alert("Please confirm your password.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Account created successfully!");

    setEmail(signupEmail);
    setPassword(signupPassword);

    setFullName("");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmPassword("");

    setShowSignupPassword(false);
    setShowConfirmPassword(false);

    setShowSignUp(false);
    setShowForgotPassword(false);
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    sessionStorage.removeItem(
      "isLoggedIn"
    );

    setIsLoggedIn(false);

    setShowAnalyze(false);
    setShowProjectOverview(false);
    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
    setShowCodeStructure(false);

    setShowForgotPassword(false);
    setShowSignUp(false);
    setShowPassword(false);

    setPassword("");
  };


  // =====================================================
  // OPEN ANALYZE REPOSITORY
  // =====================================================

  const handleAnalyzeRepository = () => {

    setShowAnalyze(true);

    setShowProjectOverview(false);
    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
    setShowCodeStructure(false);
  };


  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  const handleBackToDashboard = () => {

    setShowAnalyze(false);
    setShowProjectOverview(false);
    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
    setShowCodeStructure(false);
  };


  // =====================================================
  // OPEN PROJECT OVERVIEW
  // =====================================================

  const handleProjectOverview = () => {

    setShowAnalyze(false);

    setShowProjectOverview(true);

    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
    setShowCodeStructure(false);
  };


  // =====================================================
  // BACK FROM PROJECT OVERVIEW
  // =====================================================

  const handleBackFromProjectOverview = () => {

    setShowProjectOverview(false);

    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
    setShowCodeStructure(false);

    setShowAnalyze(true);
  };


  // =====================================================
  // OPEN DETAILED AI ANALYSIS
  // =====================================================

  const handleDetailedAnalysis = () => {

    setShowProjectOverview(false);
    setShowAnalyze(false);

    setShowDetailedAnalysis(true);

    setShowDocumentation(false);
    setShowCodeStructure(false);
  };


  // =====================================================
  // BACK FROM DETAILED ANALYSIS
  // =====================================================

  const handleBackFromDetailedAnalysis = () => {

    setShowDetailedAnalysis(false);

    setShowProjectOverview(true);

    setShowDocumentation(false);
    setShowCodeStructure(false);
  };


  // =====================================================
  // OPEN DOCUMENTATION
  // =====================================================

  const handleDocumentation = () => {

    setShowProjectOverview(false);
    setShowDetailedAnalysis(false);
    setShowAnalyze(false);

    setShowDocumentation(true);

    setShowCodeStructure(false);
  };


  // =====================================================
  // BACK FROM DOCUMENTATION
  // =====================================================

  const handleBackFromDocumentation = () => {

    setShowDocumentation(false);

    setShowProjectOverview(true);

    setShowCodeStructure(false);
  };


  // =====================================================
  // OPEN CODE STRUCTURE
  // =====================================================

  const handleCodeStructure = () => {

    console.log(
      "Explore Code Structure clicked"
    );

    setShowProjectOverview(false);
    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
    setShowAnalyze(false);

    setShowCodeStructure(true);
  };


  // =====================================================
  // BACK FROM CODE STRUCTURE
  // =====================================================

  const handleBackFromCodeStructure = () => {

    setShowCodeStructure(false);

    setShowProjectOverview(true);

    setShowDetailedAnalysis(false);
    setShowDocumentation(false);
  };


  // =====================================================
  // CODE STRUCTURE SCREEN
  // =====================================================

  if (
    isLoggedIn &&
    showCodeStructure
  ) {

    return (
      <CodeStructure
        onBack={
          handleBackFromCodeStructure
        }
      />
    );
  }


  // =====================================================
  // DOCUMENTATION SCREEN
  // =====================================================

  if (
    isLoggedIn &&
    showDocumentation
  ) {

    return (
      <Documentation
        onBack={
          handleBackFromDocumentation
        }
      />
    );
  }


  // =====================================================
  // DETAILED AI ANALYSIS SCREEN
  // =====================================================

  if (
    isLoggedIn &&
    showDetailedAnalysis
  ) {

    return (
      <DetailedAnalysis
        onBack={
          handleBackFromDetailedAnalysis
        }
      />
    );
  }


  // =====================================================
  // PROJECT OVERVIEW SCREEN
  // =====================================================

  if (
    isLoggedIn &&
    showProjectOverview
  ) {

    return (
      <ProjectOverview

        onBack={
          handleBackFromProjectOverview
        }

        onDocumentation={
          handleDocumentation
        }

        onDetailedAnalysis={
          handleDetailedAnalysis
        }

        onCodeStructure={
          handleCodeStructure
        }

      />
    );
  }


  // =====================================================
  // ANALYZE REPOSITORY SCREEN
  // =====================================================

  if (
    isLoggedIn &&
    showAnalyze
  ) {

    return (
      <AnalyzeRepository

        onBack={
          handleBackToDashboard
        }

        onAnalyze={
          handleProjectOverview
        }

      />
    );
  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  if (isLoggedIn) {

    return (
      <Dashboard

        onLogout={
          handleLogout
        }

        onAnalyzeRepository={
          handleAnalyzeRepository
        }

      />
    );
  }


  // =====================================================
  // LOGIN PAGE
  // =====================================================

  return (

    <div className="login-page">

      {/* BACKGROUND */}

      <div className="background">

        <Topography

          lowColor="#5227FF"

          midColor="#FF9FFC"

          highColor="#FFFFFF"

          speed={0.35}

          morphAmount={3}

          morphSpeed={0.05}

          bands={2}

          thickness={0.01}

          scale={2}

          pixelSize={1}

          glow={0.5}

          colorMode="elevation"

          contrast={3}

          brightness={1}

          fillBands={false}

          opacity={1}

          grain={true}

          grainIntensity={0.05}

          mouseInteraction={true}

          mouseRadius={0.3}

          mouseStrength={0.4}

        />

      </div>


      {/* LOGIN CONTAINER */}

      <main className="login-container">

        <div className="login-card">


          {/* LOGIN */}

          {!showForgotPassword &&
            !showSignUp && (

              <>

                <h1>
                  Welcome to IBM
                </h1>

                <p className="subtitle">
                  Sign in to continue to your workspace
                </p>


                {/* EMAIL */}

                <div className="input-group">

                  <label>
                    Email Address
                  </label>

                  <div className="input-wrapper">

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="user@company.com"
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div className="input-group">

                  <label>
                    Password
                  </label>

                  <div className="input-wrapper">

                    <input

                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      value={password}

                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }

                      placeholder="Enter your password"

                    />

                    <button

                      type="button"

                      className="password-toggle"

                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }

                    >
                      {showPassword
                        ? "◉"
                        : "○"}
                    </button>

                  </div>

                </div>


                {/* SIGN IN */}

                <button

                  className="signin-button"

                  type="button"

                  onClick={
                    handleSignIn
                  }

                >
                  Sign In

                </button>


                {/* DIVIDER */}

                <div className="divider">
                  <span>or</span>
                </div>


                {/* GOOGLE */}

                <button
                  className="google-button"
                  type="button"
                >

                  <span>G</span>

                  Sign in with Google

                </button>


                {/* LINKS */}

                <div className="bottom-links">

                  <button

                    className="link-button"

                    type="button"

                    onClick={() => {

                      setShowForgotPassword(
                        true
                      );

                      setShowSignUp(
                        false
                      );

                    }}

                  >
                    Forgot Password?
                  </button>


                  <button

                    className="link-button"

                    type="button"

                    onClick={() => {

                      setShowSignUp(
                        true
                      );

                      setShowForgotPassword(
                        false
                      );

                    }}

                  >
                    Sign Up
                  </button>

                </div>

              </>

            )}


          {/* FORGOT PASSWORD */}

          {showForgotPassword &&
            !showSignUp && (

              <div className="forgot-password">

                <button

                  className="back-button"

                  type="button"

                  onClick={() =>
                    setShowForgotPassword(
                      false
                    )
                  }

                >
                  ← Back to Login
                </button>


                <h1>
                  Forgot Password?
                </h1>

                <p className="subtitle">
                  Enter your email address and
                  we'll send you a password reset link.
                </p>


                <div className="input-group">

                  <label>
                    Email Address
                  </label>

                  <div className="input-wrapper">

                    <input
                      type="email"
                      placeholder="user@company.com"
                    />

                  </div>

                </div>


                <button

                  className="signin-button"

                  type="button"

                  onClick={() =>
                    alert(
                      "Reset link sent! (Frontend demo)"
                    )
                  }

                >
                  Send Reset Link
                </button>

              </div>

            )}


          {/* SIGN UP */}

          {showSignUp &&
            !showForgotPassword && (

              <div className="signup">

                <button

                  className="back-button"

                  type="button"

                  onClick={() =>
                    setShowSignUp(
                      false
                    )
                  }

                >
                  ← Back to Login
                </button>


                <h1>
                  Create Account
                </h1>

                <p className="subtitle">
                  Create your account to get started
                </p>


                {/* FULL NAME */}

                <div className="input-group">

                  <label>
                    Full Name
                  </label>

                  <div className="input-wrapper">

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(
                          e.target.value
                        )
                      }
                      placeholder="Enter your full name"
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div className="input-group">

                  <label>
                    Email Address
                  </label>

                  <div className="input-wrapper">

                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) =>
                        setSignupEmail(
                          e.target.value
                        )
                      }
                      placeholder="user@company.com"
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div className="input-group">

                  <label>
                    Password
                  </label>

                  <div className="input-wrapper">

                    <input

                      type={
                        showSignupPassword
                          ? "text"
                          : "password"
                      }

                      value={
                        signupPassword
                      }

                      onChange={(e) =>
                        setSignupPassword(
                          e.target.value
                        )
                      }

                      placeholder="Create a password"

                    />

                    <button

                      type="button"

                      className="password-toggle"

                      onClick={() =>
                        setShowSignupPassword(
                          !showSignupPassword
                        )
                      }

                    >
                      {showSignupPassword
                        ? "◉"
                        : "○"}
                    </button>

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="input-group">

                  <label>
                    Confirm Password
                  </label>

                  <div className="input-wrapper">

                    <input

                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }

                      value={
                        confirmPassword
                      }

                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }

                      placeholder="Confirm your password"

                    />

                    <button

                      type="button"

                      className="password-toggle"

                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }

                    >
                      {showConfirmPassword
                        ? "◉"
                        : "○"}
                    </button>

                  </div>

                </div>


                {/* CREATE ACCOUNT */}

                <button

                  className="signin-button"

                  type="button"

                  onClick={
                    handleSignUp
                  }

                >
                  Create Account

                </button>


                {/* DIVIDER */}

                <div className="divider">
                  <span>or</span>
                </div>


                {/* GOOGLE */}

                <button

                  className="google-button"

                  type="button"

                >

                  <span>G</span>

                  Sign up with Google

                </button>

              </div>

            )}

        </div>

      </main>

    </div>

  );
}

export default App;