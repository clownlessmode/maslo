import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { Suspense } from "react"
import { Mesh } from "./mesh"
import Light from "./light"
import { useEffect, useState } from "react"

const Loader = () => {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-white/20 rounded-full" />
          <div
            className="absolute w-full h-full border-4 border-brand rounded-full animate-[spin_1s_linear_infinite]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
          />
        </div>
      </div>
    </Html>
  )
}

export default function Model() {
  const [distance, setDistance] = useState({ min: 0.8, max: 0.8 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateDistances = () => {
      const mobile = window.innerWidth <= 744
      setIsMobile(mobile)
      setDistance({
        min: mobile ? 0.7 : 0.8,
        max: mobile ? 0.7 : 0.8,
      })
    }

    updateDistances()

    const debouncedResize = debounce(updateDistances, 250)
    window.addEventListener("resize", debouncedResize)

    return () => {
      window.removeEventListener("resize", debouncedResize)
    }
  }, [])

  return (
    <Canvas
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        precision: isMobile ? "lowp" : "highp",
      }}
      camera={{
        position: [0, 0, 0.55],
        near: 0.1,
        far: 1000,
      }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, isMobile ? 1.5 : 2]}
    >
      <Suspense fallback={<Loader />}>
        <OrbitControls
          enableRotate
          enableDamping
          dampingFactor={0.03}
          minDistance={distance.min}
          maxDistance={distance.max}
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Light />
        <Mesh />
      </Suspense>
    </Canvas>
  )
}

// Type-safe debounce function
const debounce = (fn: (...args: any[]) => void, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}
