import Silk from "./Silk";
import "./SilkBackground.css";

function SilkBackground() {
  return (
    <div className="silk-background">
      <Silk
        speed={5}
        scale={1}
        color="#2563EB"
        noiseIntensity={1.5}
        rotation={0}
      />
    </div>
  );
}

export default SilkBackground;