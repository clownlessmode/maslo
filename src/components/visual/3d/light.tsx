import React from "react"
import { useThree } from "@react-three/fiber"
import { Color } from "three"

const Light = () => {
  const lightness = 2

  return (
    <>
      {/* Передний свет */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2 * lightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Задний свет */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={2 * lightness}
        castShadow
      />

      {/* Боковой свет слева */}
      <directionalLight
        position={[-5, 0, 0]}
        intensity={1.5 * lightness}
        castShadow
      />

      {/* Боковой свет справа */}
      <directionalLight
        position={[5, 0, 0]}
        intensity={1.5 * lightness}
        castShadow
      />

      {/* Верхний свет */}
      <directionalLight
        position={[0, 5, 0]}
        intensity={1.5 * lightness}
        castShadow
      />

      {/* Мягкий рассеянный свет для заполнения теней */}
      <ambientLight intensity={1 * lightness} color={0xffffff} />

      {/* Полусферическое освещение для более естественного вида */}
      <hemisphereLight
        skyColor={0xffffff}
        groundColor={0x444444}
        intensity={0.5 * lightness}
      />

      {/* Мягкий нижний свет для подсветки теней */}
      <pointLight
        position={[0, -3, 0]}
        intensity={1 * lightness}
        distance={10}
        decay={2}
      />
    </>
  )
}

export default Light
