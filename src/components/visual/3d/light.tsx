import React from "react"
import { useThree } from "@react-three/fiber"
import { Color } from "three"

const Light = () => {
  const lightness = 3

  return (
    <>
      {/* Основной направленный свет */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={4 * lightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.005}
      />

      {/* Мягкий рассеянный свет */}
      <ambientLight intensity={1.5 * lightness} color={0xffffff} />

      {/* Контровой свет */}
      <spotLight
        position={[-5, 5, -5]}
        angle={0.3}
        penumbra={1}
        intensity={3 * lightness}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Заполняющий свет */}
      <pointLight
        position={[0, -3, 0]}
        intensity={2 * lightness}
        distance={10}
        decay={1.5}
        color={0xf0f0ff} // Легкий голубоватый оттенок
      />

      {/* Мягкий нижний свет */}
      <hemisphereLight groundColor={0x080820} intensity={1 * lightness} />
    </>
  )
}

export default Light
