"use client"

import { OrbitControls, useProgress, Html, useGLTF } from "@react-three/drei"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Suspense, useRef, useEffect, useMemo, useState } from "react"
import * as THREE from "three"
import { FC } from "react"

interface ModelProps {
  url: string
  key?: string | number
}

const Preloader: FC = () => {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="loader mb-4"></div>
        <span className="text-white">Loading {progress.toFixed(2)}%</span>
      </div>
    </Html>
  )
}

const ErrorBoundary: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error: any) => {
      console.error("3D Model Rendering Error:", error)
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <Html center>
        <div className="text-red-500">
          Error loading 3D model. Please try again.
        </div>
      </Html>
    )
  }

  return <>{children}</>
}

const Model: FC<ModelProps> = ({ url }) => {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()
  const [isLoaded, setIsLoaded] = useState(false)

  useFrame(() => {
    // Добавляем автоматическую проверку видимости
    if (modelRef.current && !isLoaded) {
      console.log("Model loaded, performing initial setup")
      setIsLoaded(true)
    }
  })

  useEffect(() => {
    if (!scene) {
      console.error("Scene is undefined for URL:", url)
      return
    }

    try {
      // Сброс трансформаций
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose())
          } else if (child.material) {
            child.material.dispose()
          }
        }
      })

      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3()).length()

      const scale = 1 / size
      scene.scale.set(scale, scale, scale)
      scene.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      )

      // Обновление материалов
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.Material) {
            child.material.needsUpdate = true
          }
        }
      })

      console.log("Model processing completed successfully")
    } catch (error) {
      console.error("Error processing model:", error)
    }
  }, [scene, url])

  // Логирование состояния модели
  useEffect(() => {
    if (modelRef.current) {
      console.log("Model ref current:", modelRef.current)
    }
  }, [modelRef.current])

  return (
    <primitive
      ref={modelRef}
      object={scene}
      visible={isLoaded}
      // Принудительное позиционирование
      position={[0, 0, 0]}
    />
  )
}

const ModelViewer: FC<ModelProps> = ({ url, key }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lightness = 4

  // Предзагрузка модели
  useEffect(() => {
    useGLTF.preload(url)
  }, [url])

  useEffect(() => {
    const container = containerRef.current
    const preventDefault = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    if (container) {
      container.addEventListener("wheel", preventDefault, { passive: false })
      return () => {
        container.removeEventListener("wheel", preventDefault)
      }
    }
  }, [])

  return (
    <div ref={containerRef} key={key} className="w-full h-full relative">
      <Canvas
        key={`canvas-${key}`}
        camera={{
          position: [0, 0, 0.55],
          near: 0.1,
          far: 1000,
        }}
        style={{ width: "100%", height: "100%" }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={<Preloader />}>
            <spotLight
              position={[0, 1, 2]}
              angle={0.2}
              penumbra={0.8}
              intensity={4 * lightness}
              castShadow
            />
            <ambientLight intensity={2 * lightness} />
            <spotLight
              position={[0, -1, 2]}
              angle={0.2}
              penumbra={0.8}
              intensity={4 * lightness}
              castShadow
            />
            <pointLight
              position={[0, -1, -2]}
              intensity={3 * lightness}
              distance={5}
              decay={2}
            />
            <Model url={url} />
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
          </Suspense>
        </ErrorBoundary>
      </Canvas>
    </div>
  )
}

export default ModelViewer
