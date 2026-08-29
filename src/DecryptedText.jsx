
import React, { useEffect, useState } from "react";

function DecryptedText({
  text = "",
  speed = 70,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
}) {
  const [displayText, setDisplayText] = useState("");

  // Mathematical Italic - NOT BOLD
  const italicMap = {
    A: "𝐴",
    B: "𝐵",
    C: "𝐶",
    D: "𝐷",
    E: "𝐸",
    F: "𝐹",
    G: "𝐺",
    H: "𝐻",
    I: "𝐼",
    J: "𝐽",
    K: "𝐾",
    L: "𝐿",
    M: "𝑀",
    N: "𝑁",
    O: "𝑂",
    P: "𝑃",
    Q: "𝑄",
    R: "𝑅",
    S: "𝑆",
    T: "𝑇",
    U: "𝑈",
    V: "𝑉",
    W: "𝑊",
    X: "𝑋",
    Y: "𝑌",
    Z: "𝑍",

    a: "𝑎",
    b: "𝑏",
    c: "𝑐",
    d: "𝑑",
    e: "𝑒",
    f: "𝑓",
    g: "𝑔",
    h: "ℎ",
    i: "𝑖",
    j: "𝑗",
    k: "𝑘",
    l: "𝑙",
    m: "𝑚",
    n: "𝑛",
    o: "𝑜",
    p: "𝑝",
    q: "𝑞",
    r: "𝑟",
    s: "𝑠",
    t: "𝑡",
    u: "𝑢",
    v: "𝑣",
    w: "𝑤",
    x: "𝑥",
    y: "𝑦",
    z: "𝑧",

    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
  };

  const toItalic = (value) => {
    return value
      .split("")
      .map((char) => italicMap[char] || char)
      .join("");
  };

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      return;
    }

    let currentIndex = 0;

    const randomCharacter = () => {
      return characters[
        Math.floor(Math.random() * characters.length)
      ];
    };

    const interval = setInterval(() => {
      let result = "";

      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === " " || !/[a-zA-Z0-9]/.test(char)) {
          result += char;
          continue;
        }

        if (i < currentIndex) {
          result += char;
        } else {
          result += randomCharacter();
        }
      }

      setDisplayText(result);

      currentIndex++;

      if (currentIndex > text.length) {
        clearInterval(interval);

        // Final result = thin italic, NOT bold
        setDisplayText(toItalic(text));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, characters]);

  return (
    <span className="decrypted-text">
      {displayText}
    </span>
  );
}

export default DecryptedText;
