import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const CursorGlowEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [])

  return (
    <div style={{ height: "100vh absolute" }}>
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "0px", // Уменьшенный размер
          height: "0px",
          borderRadius: "50%",
          boxShadow: "0 0 100px 50px rgba(255, 217, 114, 1)", // Большое свечение
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          filter: "blur(5px)",
          opacity: 0.1,
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          duration: 0, // Мгновенное следование за курсором
          ease: "linear",
        }}
      />
    </div>
  )
}

export default CursorGlowEffect
