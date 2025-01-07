import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const FooterSlider = () => {
  const revealRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ["start start", "end end"],
  })

  // Анимация движения желтого блока
  const slideX = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"])

  // Анимация ширины первого и второго изображений
  const firstImageWidth = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["66.666%", "33.333%", "0%"]
  )

  const secondImageWidth = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["33.333%", "66.666%", "100%"]
  )

  return (
    <div ref={revealRef} className="w-full h-[300vh]">
      <div className="sticky top-0 w-full h-screen">
        <div className="relative w-full h-full overflow-hidden">
          {/* Первое изображение */}
          <motion.div
            className="absolute inset-y-0 left-0 h-full"
            style={{
              width: firstImageWidth,
              backgroundImage: `url('/lookbook/slides/1.jpg')`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              zIndex: 1,
            }}
          />

          {/* Второе изображение */}
          <motion.div
            className="absolute inset-y-0 right-0 h-full"
            style={{
              width: secondImageWidth,
              backgroundImage: `url('/lookbook/slides/2.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 2,
            }}
          />

          {/* Sliding yellow section */}
          <motion.div
            className="absolute top-0 right-0 w-1/3 h-full bg-brand flex items-center justify-center z-[3]"
            style={{ x: slideX }}
          >
            <div className="p-12">
              <h2 className="text-black text-4xl font-bold">
                ЯРКАЯ
                <br />
                ЗАВЕРШАЮЩАЯ
                <br />
                НАДПИСЬ
              </h2>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FooterSlider
