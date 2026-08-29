import React, { useEffect, useState } from "react";

function DecryptedText({
  text = "",
  speed = 50,
  maxIterations = 10,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  sequential = false,
  revealDirection = "start",
  animateOn = "view",
  useOriginalCharsOnly = false,
}) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let interval;
    let iteration = 0;

    const chars = useOriginalCharsOnly
      ? text.split("")
      : characters.split("");

    const randomChar = () => {
      if (!chars.length) return "";
      return chars[Math.floor(Math.random() * chars.length)];
    };

    const animate = () => {
      iteration = 0;

      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";

              if (sequential) {
                const revealIndex =
                  revealDirection === "start"
                    ? index
                    : text.length - index - 1;

                if (iteration > revealIndex) {
                  return char;
                }
              } else {
                if (iteration > maxIterations) {
                  return char;
                }
              }

              return randomChar();
            })
            .join("");
        });

        iteration++;

        if (
          sequential
            ? iteration > text.length + maxIterations
            : iteration > maxIterations
        ) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, speed);
    };

    if (animateOn === "view") {
      animate();
    } else {
      animate();
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    text,
    speed,
    maxIterations,
    characters,
    sequential,
    revealDirection,
    animateOn,
    useOriginalCharsOnly,
  ]);

  return <span className="decrypted-text">{displayText}</span>;
}

export default DecryptedText;