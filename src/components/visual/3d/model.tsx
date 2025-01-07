import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Mesh } from "./mesh"
import Light from "./light"

export default function Model() {
  return (
    <Canvas
      gl={{
        antialias: false,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [0, 0, 0.55],
        near: 0.1,
        far: 1000,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <OrbitControls
        enableRotate
        enableDamping
        dampingFactor={0.03}
        minDistance={0.6}
        maxDistance={0.8}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <Light />
      <Mesh />
    </Canvas>
  )
}
