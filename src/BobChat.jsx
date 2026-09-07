import { useEffect, useState } from "react";
import "./BobChat.css";
import ReactMarkdown from "react-markdown";
import "./BobChat.css";
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function BobChat({ onBack, projectId }) {
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] =
    useState(projectId || "");

  const [projectsLoading, setProjectsLoading] =
    useState(true);

  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "bob",
      text: "Hi! I'm Bob. I can help you understand your codebase, modules and documentation.",
    },
  ]);

  // =========================================
  // LOAD PROJECTS
  // =========================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load projects"
          );
        }

        const loadedProjects =
          data.projects || [];

        setProjects(loadedProjects);

        if (
          projectId &&
          loadedProjects.some(
            (project) =>
              project._id === projectId
          )
        ) {
          setSelectedProjectId(projectId);
        } else if (loadedProjects.length > 0) {
          setSelectedProjectId(
            loadedProjects[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Bob Chat project loading error:",
          error
        );
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, [projectId]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const handleSend = async () => {
    const text = message.trim();

    if (!text || sending) return;

    if (!selectedProjectId) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bob",
          text: "Please select a project before asking Bob a question.",
        },
      ]);

      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
      },
    ]);

    setMessage("");
    setSending(true);

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/bob-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId:
              selectedProjectId,
            message: text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Bob could not answer."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bob",
          text:
            data.answer ||
            "Bob returned an empty response.",
        },
      ]);
    } catch (error) {
      console.error(
        "Bob Chat request error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "bob",
          text:
            error.message ||
            "Something went wrong while contacting Bob.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // =========================================
  // ENTER KEY
  // ENTER = SEND
  // SHIFT + ENTER = NEW LINE
  // =========================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  // =========================================
  // QUICK QUESTION
  // =========================================

  const handleQuickQuestion = (text) => {
    setMessage(text);
  };

  return (
    <div className="bob-chat-page">

      {/* HEADER */}

      <header className="bob-chat-header">

        <button
          type="button"
          className="bob-back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="bob-brand">

          <div className="bob-brand-icon">
            ✦
          </div>

          <div>
            <strong>Bob Chat</strong>
            <span>AI Code Assistant</span>
          </div>

        </div>

        <div className="bob-status">
          <span className="bob-status-dot"></span>

          {sending
            ? "Thinking..."
            : "Ready"}
        </div>

      </header>

      {/* MAIN */}

      <main className="bob-chat-main">

        {/* TITLE */}

        <div className="bob-chat-title">

          <div className="bob-title-icon">
            ✦
          </div>

          <div>
            <h1>
              Bob Chat
            </h1>

            <p>
              Your AI code assistant is ready.
            </p>
          </div>

        </div>

        {/* CHAT CARD */}

        <section className="bob-chat-card">

          {/* PROJECT SELECTOR */}

          <div
            style={{
              padding: "16px 22px",
              background: "#ffffff",
              borderBottom:
                "1px solid #e4e9ef",
            }}
          >
            <label
              htmlFor="bob-project-select"
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#536174",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Repository
            </label>

            <select
              id="bob-project-select"
              value={selectedProjectId}
              onChange={(event) =>
                setSelectedProjectId(
                  event.target.value
                )
              }
              disabled={projectsLoading || sending}
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                borderRadius: "9px",
                border:
                  "1px solid #d5dde7",
                background: "#fbfcfe",
                color: "#263246",
                fontFamily: "inherit",
                fontSize: "13px",
                fontWeight: "600",
                outline: "none",
              }}
            >
              {projectsLoading ? (
                <option value="">
                  Loading projects...
                </option>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                ))
              ) : (
                <option value="">
                  No analyzed projects
                </option>
              )}
            </select>
          </div>

          {/* CHAT HEADER */}

          <div className="bob-chat-card-header">

            <div className="bob-avatar">
              B
            </div>

            <div>

              <h2>
                Bob
              </h2>

              <span>
                AI Code Assistant
              </span>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="bob-messages">

            {messages.map(
              (item, index) => (

                <div
                  key={index}
                  className={`bob-message-row ${item.type}`}
                >

                  {item.type === "bob" && (
                    <div className="message-avatar">
                      ✦
                    </div>
                  )}

                  <div
                    className={`bob-message ${
                      item.type === "user"
                        ? "user-message"
                        : "assistant-message"
                    }`}
                  >
                    {item.type === "user" ? (
                      item.text
                    ) : (
                      <ReactMarkdown>
                        {item.text}
                      </ReactMarkdown>
                    )}
                  </div>

                </div>

              )
            )}

            {sending && (
              <div className="bob-message-row bob">
                <div className="message-avatar">
                  ✦
                </div>

                <div className="bob-message assistant-message">
                  Bob is analyzing the repository...
                </div>
              </div>
            )}

          </div>
          <div
            className={`bob-message ${
              item.type === "user"
                ? "user-message"
                : "assistant-message"
            }`}
          >
            {item.type === "user" ? (
              item.text
            ) : (
              <ReactMarkdown>
                {item.text}
              </ReactMarkdown>
            )}
          </div>

          {/* QUICK QUESTIONS */}

          <div className="bob-quick-actions">

            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  "Explain my project."
                )
              }
            >
              Explain my project
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  "Explain the project architecture."
                )
              }
            >
              Explain architecture
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  "What technologies are used?"
                )
              }
            >
              Show technologies
            </button>

          </div>

          {/* INPUT */}

          <div className="bob-input-area">

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask Bob about your code..."
              rows="1"
              disabled={sending}
              aria-label="Ask Bob"
            />

            <button
              type="button"
              className="bob-send-button"
              onClick={handleSend}
              disabled={
                sending ||
                !message.trim() ||
                !selectedProjectId
              }
            >
              {sending
                ? "Thinking..."
                : "Send"}

              {!sending && (
                <span>✦</span>
              )}
            </button>

          </div>

          <p className="bob-footer-text">
            Bob can explain your codebase, modules,
            architecture and documentation.
          </p>

        </section>

      </main>

    </div>
  );
}

export default BobChat;