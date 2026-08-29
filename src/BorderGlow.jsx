import { useRef, useCallback } from "react";
import "./BorderGlow.css";

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);

  if (!match) {
    return { h: 40, s: 80, l: 80 };
  }

  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);

  const base = `${h}deg ${s}% ${l}%`;

  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];

  const vars = {};

  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] =
      `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }

  return vars;
}

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];

const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];

const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};

  for (let i = 0; i < 7; i++) {
    const color =
      colors[Math.min(COLOR_MAP[i], colors.length - 1)];

    vars[GRADIENT_KEYS[i]] =
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${color} 0px, transparent 50%)`;
  }

  vars["--gradient-base"] =
    `linear-gradient(${colors[0]} 0 100%)`;

  return vars;
}

function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
}) {
  const cardRef = useRef(null);

  const getCenter = useCallback((element) => {
    const rect = element.getBoundingClientRect();

    return [
      rect.width / 2,
      rect.height / 2,
    ];
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      const card = cardRef.current;

      if (!card) return;

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const [cx, cy] = getCenter(card);

      const distanceLeft = x;
      const distanceRight = rect.width - x;
      const distanceTop = y;
      const distanceBottom = rect.height - y;

      const distanceToEdge = Math.min(
        distanceLeft,
        distanceRight,
        distanceTop,
        distanceBottom
      );

      const maxDistance =
        Math.min(rect.width, rect.height) / 2;

      const proximity =
        Math.max(
          0,
          Math.min(
            100,
            100 - (distanceToEdge / maxDistance) * 100
          )
        );

      const dx = x - cx;
      const dy = y - cy;

      let angle =
        Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      if (angle < 0) {
        angle += 360;
      }

      card.style.setProperty(
        "--edge-proximity",
        proximity
      );

      card.style.setProperty(
        "--cursor-angle",
        `${angle}deg`
      );
    },
    [getCenter]
  );

  const glowVars = buildGlowVars(
    glowColor,
    glowIntensity
  );

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        ...glowVars,
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />

      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
}

export default BorderGlow;