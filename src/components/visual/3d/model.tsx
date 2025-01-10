import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Mesh } from "./mesh"
import Light from "./light"
import { useEffect, useState } from "react"

export default function Model() {
  const [distance, setDistance] = useState({ min: 0.8, max: 0.8 })

  useEffect(() => {
    // Функция для определения расстояний в зависимости от ширины экрана
    const updateDistances = () => {
      if (window.innerWidth <= 744) {
        // Если мобильное устройство
        setDistance({ min: 0.7, max: 0.7 }) // Настройки для мобильных
      } else {
        // Настройки для десктопов
        setDistance({ min: 0.8, max: 0.8 })
      }
    }

    // Обновить расстояния при загрузке
    updateDistances()

    // Обновить расстояния при изменении размеров окна
    window.addEventListener("resize", updateDistances)

    // Очистить слушатель события при размонтировании компонента
    return () => {
      window.removeEventListener("resize", updateDistances)
    }
  }, [])

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
        minDistance={distance.min}
        maxDistance={distance.max}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <Light />
      <Mesh />
    </Canvas>
  )
}
