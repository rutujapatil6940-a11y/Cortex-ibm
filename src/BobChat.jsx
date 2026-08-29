
import { useState } from "react";
import "./BobChat.css";

function BobChat({ onBack }) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "bob",
      text: "Hi! I'm Bob. I can help you understand your codebase, modules and documentation.",
    },
  ]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const handleSend = () => {
    const text = message.trim();

    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
      },
      {
        type: "bob",
        text: "Repository analysis is available from the Analyze Repository page. Use it first, then review the AI-generated results in Cortex.",
      },
    ]);

    setMessage("");
  };

  // =========================================
  // ENTER KEY
  // ENTER = SEND
  // SHIFT + ENTER = NEW LINE
  // =========================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
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

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="bob-chat-header">

        <button
          type="button"
          className="bob-back-button"
          onClick={onBack}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onBack();
            }
          }}
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
          Ready
        </div>

      </header>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="bob-chat-main">


        {/* =========================================
            TITLE
        ========================================= */}

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


        {/* =========================================
            CHAT CARD
        ========================================= */}

        <section className="bob-chat-card">


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


          {/* =========================================
              MESSAGES
          ========================================= */}

          <div className="bob-messages">

            {messages.map((item, index) => (

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
                  {item.text}
                </div>

              </div>

            ))}

          </div>


          {/* =========================================
              QUICK QUESTIONS
          ========================================= */}

          <div className="bob-quick-actions">

            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  "Explain my project."
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  handleQuickQuestion(
                    "Explain my project."
                  );
                }
              }}
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
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  handleQuickQuestion(
                    "Explain the project architecture."
                  );
                }
              }}
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
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  handleQuickQuestion(
                    "What technologies are used?"
                  );
                }
              }}
            >
              Show technologies
            </button>

          </div>


          {/* =========================================
              INPUT
          ========================================= */}

          <div className="bob-input-area">

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask Bob about your code..."
              rows="1"
              aria-label="Ask Bob"
            />


            <button
              type="button"
              className="bob-send-button"
              onClick={handleSend}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSend();
                }
              }}
            >
              Send
              <span>✦</span>
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
