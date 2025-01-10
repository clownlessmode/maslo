import Container from "@/components/layout/container"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const ImageParallax = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"],
  })

  const firstTextOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.4, 0.5],
    [0, 1, 1, 0]
  )

  const secondTextOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.9, 1],
    [0, 1, 1, 0]
  )

  const y1 = useTransform(scrollYProgress, [0.0, 0.95], ["100vh", "-100vh"])
  const y2 = useTransform(scrollYProgress, [0.23, 0.98], ["100vh", "-100vh"])
  const y3 = useTransform(scrollYProgress, [0.31, 1.3], ["100vh", "-100vh"])
  const y4 = useTransform(scrollYProgress, [0.575, 1.35], ["100vh", "-100vh"])
  const y5 = useTransform(scrollYProgress, [0.48, 1.6], ["100vh", "-100vh"])

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Определяем базовые размеры и отступы для всех изображений
  const images = {
    img1: {
      src: "/lookbook/parallax/1.jpg",
      width: 600,
      height: 765,
      position: { left: 40 },
      zIndex: 2,
    },
    img2: {
      src: "/lookbook/parallax/4.jpg",
      width: 910,
      height: 848,
      position: { right: 40 },
      zIndex: 0,
    },
    img3: {
      src: "/lookbook/parallax/7.jpg",
      width: 460,
      height: 585,
      position: { left: 363 },
      zIndex: 1,
    },
    img4: {
      src: "/lookbook/parallax/6.jpg",
      width: 460,
      height: 585,
      position: { left: 40 },
      zIndex: 3,
    },
    img5: {
      src: "/lookbook/parallax/3.jpg",
      width: 452,
      height: 577,
      position: { right: 137 },
      zIndex: 2,
    },
  }

  const getResponsiveSize = (originalWidth, originalHeight) => {
    const baseScreenWidth = 1440
    let scale = Math.min(1, Math.max(0.5, windowWidth / baseScreenWidth))

    const width = Math.round(originalWidth * scale)
    const height = Math.round(originalHeight * scale)

    return { width, height }
  }

  const getResponsivePosition = (position) => {
    const baseScreenWidth = 1440
    let scale = Math.min(1, Math.max(0.5, windowWidth / baseScreenWidth))

    if (position.left) {
      return { left: `${Math.round(position.left * scale)}px` }
    }
    if (position.right) {
      return { right: `${Math.round(position.right * scale)}px` }
    }
    return {}
  }

  return (
    <Container
      className="-mt-[70vh] relative w-full h-[600vh]"
      ref={containerRef}
    >
      <div className="fixed z-10 top-0 left-0 w-full h-screen flex items-center justify-center">
        <motion.div
          style={{ opacity: firstTextOpacity }}
          className="absolute w-full"
        >
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="overflow-clip z-[5]">
              <h1 className="xl:text-[60px] xl:leading-[66px] lg:text-[46px] lg:leading-[54px] md:text-[42px] md:leading-[50px] sm:text-[34px] sm:leading-[42px] text-[30px] leading-[36px] tracking-[-0.04em] uppercase text-center z-[5]">
                Зачем быть
              </h1>
            </div>
            <div className="overflow-clip z-[5]">
              <h1 className="xl:text-[120px] xl:leading-[120px] lg:text-[46px] lg:leading-[54px] md:text-[42px] md:leading-[50px] sm:text-[34px] sm:leading-[42px] text-[30px] leading-[36px] tracking-[-0.04em] uppercase text-center z-[5]">
                Обычным
              </h1>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: secondTextOpacity }}
          className="absolute w-full z-10"
        >
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="overflow-clip z-[5]">
              <h1 className="xl:text-[60px] xl:leading-[80px] lg:text-[46px] lg:leading-[54px] md:text-[42px] md:leading-[50px] sm:text-[34px] sm:leading-[42px] text-[30px] leading-[36px] tracking-[-0.04em] uppercase text-center z-[5]">
                Когда можно быть
              </h1>
            </div>
            <div className="overflow-clip z-[5]">
              <h1 className="xl:text-[120px] xl:leading-[120px] lg:text-[46px] lg:leading-[54px] md:text-[42px] md:leading-[50px] sm:text-[34px] sm:leading-[42px] text-[30px] leading-[36px] tracking-[-0.04em] uppercase text-center z-[5] text-brand font-semibold">
                Сливочно
                <br />
                необычным?
              </h1>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
        {Object.entries(images).map(([key, img], index) => {
          const { width, height } = getResponsiveSize(img.width, img.height)
          const position = getResponsivePosition(img.position)
          const yMotion = [y1, y2, y3, y4, y5][index]

          return (
            <motion.div
              key={key}
              style={{
                y: yMotion,
                ...position,
                zIndex: img.zIndex,
                position: "absolute",
              }}
            >
              <Image
                alt="image"
                src={img.src}
                className="rounded-[20px] object-cover"
                width={width}
                height={height}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                }}
                quality={100}
              />
            </motion.div>
          )
        })}
      </div>
    </Container>
  )
}

export default ImageParallax
