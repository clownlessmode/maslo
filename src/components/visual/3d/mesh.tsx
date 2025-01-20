// // "use client"
// // import { useGLTF } from "@react-three/drei"
// // import * as THREE from "three"
// // import { memo, useMemo, useRef } from "react"
// // import { useFrame, useLoader } from "@react-three/fiber"
// // import {
// //   Box3,
// //   Group,
// //   Material,
// //   MeshStandardMaterial,
// //   Mesh as MeshType,
// //   Object3D,
// //   Vector3,
// // } from "three"
// // import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

// // interface GLTFResult {
// //   nodes: { [key: string]: MeshType }
// //   materials: { [key: string]: Material }
// //   scene: Group
// // }

// // const MeshComponent = () => {
// //   //   const file = "/assets/DamagedHelmet.gltf"

// //   // const file = "/assets/5345345345.gltf"
// //   // const meshRef = useRef<MeshType>(null!)

// //   // // Instead of passing the DRACOLoader directly, we pass the decoder path
// //   // const { scene } = useGLTF(
// //   //   file,
// //   //   "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
// //   // )

// //   const file = "/assets/5345345345.gltf"
// //   const meshRef = useRef<MeshType>(null!)

// //   const dracoLoader = new DRACOLoader()
// //   dracoLoader.setDecoderPath(
// //     "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
// //   )

// //   const gltfLoader = new GLTFLoader()
// //   gltfLoader.setDRACOLoader(dracoLoader)

// //   const { scene } = useLoader(GLTFLoader, file, (loader) => {
// //     loader.setDRACOLoader(dracoLoader)
// //   })
// //   const processedScene = useMemo(() => {
// //     if (!scene) return null

// //     const clonedScene = scene.clone()

// //     clonedScene.traverse((child: Object3D) => {
// //       if (child instanceof MeshType) {
// //         if (child.material) {
// //           if (child.material instanceof MeshStandardMaterial) {
// //             child.material.fog = false
// //             child.material.flatShading = false
// //           }
// //         }
// //       }
// //     })

// //     const box = new Box3().setFromObject(clonedScene)
// //     const center = box.getCenter(new Vector3())
// //     const size = box.getSize(new Vector3()).length()

// //     const scale = 1 / size
// //     clonedScene.scale.setScalar(scale)
// //     clonedScene.position.copy(center).multiplyScalar(-scale)

// //     return clonedScene
// //   }, [scene])

// //   useFrame((state, delta) => {
// //     if (meshRef.current) {
// //       meshRef.current.rotation.y += delta * 0.5
// //     }
// //   })

// //   return processedScene ? (
// //     <mesh ref={meshRef}>
// //       <primitive object={processedScene} />
// //     </mesh>
// //   ) : null
// // }

// // MeshComponent.displayName = "MeshComponent"

// // export const Mesh = memo(MeshComponent)
// "use client"
// import { useLoader } from "@react-three/fiber"
// import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
// import { memo, useMemo, useRef } from "react"
// import { useFrame } from "@react-three/fiber"
// import {
//   Box3,
//   Group,
//   Material,
//   MeshStandardMaterial,
//   Mesh as MeshType,
//   Object3D,
//   Vector3,
// } from "three"

// interface GLTFResult {
//   nodes: { [key: string]: MeshType }
//   materials: { [key: string]: Material }
//   scene: Group
// }

// const MeshComponent = () => {
//   const file = "/assets/5345345345.gltf"
//   const meshRef = useRef<MeshType>(null!)

//   const dracoLoader = new DRACOLoader()
//   dracoLoader.setDecoderPath(
//     "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
//   )

//   const gltfLoader = new GLTFLoader()
//   gltfLoader.setDRACOLoader(dracoLoader)

//   const { scene } = useLoader(GLTFLoader, file, (loader) => {
//     loader.setDRACOLoader(dracoLoader)
//   }) as GLTF & GLTFResult

//   const processedScene = useMemo(() => {
//     if (!scene) return null

//     const clonedScene = scene.clone()

//     clonedScene.traverse((child: Object3D) => {
//       if (child instanceof MeshType) {
//         if (child.material) {
//           if (child.material instanceof MeshStandardMaterial) {
//             child.material.fog = false
//             child.material.flatShading = false
//           }
//         }
//       }
//     })

//     const box = new Box3().setFromObject(clonedScene)
//     const center = box.getCenter(new Vector3())
//     const size = box.getSize(new Vector3()).length()

//     const scale = 1 / size
//     clonedScene.scale.setScalar(scale)
//     clonedScene.position.copy(center).multiplyScalar(-scale)

//     return clonedScene
//   }, [scene])

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += delta * 0.5
//     }
//   })

//   return processedScene ? (
//     <mesh ref={meshRef}>
//       <primitive object={processedScene} />
//     </mesh>
//   ) : null
// }

// MeshComponent.displayName = "MeshComponent"

// export const Mesh = memo(MeshComponent)
