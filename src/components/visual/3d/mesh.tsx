"use client"
import { useGLTF, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { memo, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"

const MeshComponent = () => {
  const file = "/assets/5345345345.gltf"
  const mesh = useRef<THREE.Mesh>(null!)

  // Предварительная загрузка
  useGLTF.preload(file)

  const { scene } = useGLTF(file, true)

  const processedScene = useMemo(() => {
    if (!scene) return null

    const clonedScene = scene.clone()

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose())
        } else if (child.material) {
          child.material.dispose()
        }
      }
    })

    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3()).length()

    const scale = 1 / size
    clonedScene.scale.set(scale, scale, scale)
    clonedScene.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    )

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.Material) {
          child.material.needsUpdate = true
        }
      }
    })

    return clonedScene
  }, [scene])
  useFrame(() => {
    mesh.current.rotation.y += 0.005
  })
  return processedScene ? (
    <mesh ref={mesh}>
      <primitive object={processedScene} />
    </mesh>
  ) : null
}

// Set the displayName for debugging purposes
MeshComponent.displayName = "MeshComponent"

export const Mesh = memo(MeshComponent)
