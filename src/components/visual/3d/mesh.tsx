"use client"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { memo, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import {
  Box3,
  Group,
  Material,
  MeshStandardMaterial,
  Mesh as MeshType,
  Object3D,
  Vector3,
} from "three"

interface GLTFResult {
  nodes: { [key: string]: MeshType }
  materials: { [key: string]: Material }
  scene: Group
}

const MeshComponent = () => {
  const file = "/assets/5345345345_compressed.gltf"
  const meshRef = useRef<MeshType>(null!)

  const { scene } = useGLTF(file) as unknown as GLTFResult

  const processedScene = useMemo(() => {
    if (!scene) return null

    const clonedScene = scene.clone()

    clonedScene.traverse((child: Object3D) => {
      if (child instanceof MeshType) {
        if (child.material) {
          if (child.material instanceof MeshStandardMaterial) {
            child.material.fog = false
            child.material.flatShading = false
          }
        }
      }
    })

    const box = new Box3().setFromObject(clonedScene)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3()).length()

    const scale = 1 / size
    clonedScene.scale.setScalar(scale)
    clonedScene.position.copy(center).multiplyScalar(-scale)

    return clonedScene
  }, [scene])

  // Используем useFrame для постоянного вращения
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5 // Скорость вращения можно регулировать
    }
  })

  return processedScene ? (
    <mesh ref={meshRef}>
      <primitive object={processedScene} />
    </mesh>
  ) : null
}

MeshComponent.displayName = "MeshComponent"

export const Mesh = memo(MeshComponent)
