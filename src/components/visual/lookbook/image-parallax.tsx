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
      className:
        "w-[280px] h-[357px] sm:w-[330px]  md:w-[400px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px] sm:h-[407px] md:h-[510px] lg:h-[510px] xl:h-[637px] 2xl:h-[765px]",
      position: { left: "2.5%", sm: "5%", xl: "40px" },
      zIndex: 2,
    },
    img2: {
      src: "/lookbook/parallax/4.jpg",
      className:
        "w-[280px] h-[280px] sm:w-[350px] md:w-[600px] lg:w-[600px] xl:w-[750px] 2xl:w-[910px] sm:h-[330px] md:h-[559px] lg:h-[559px] xl:h-[699px] 2xl:h-[848px]",
      position: { right: "2.5%", sm: "5%", xl: "40px" },
      zIndex: 0,
    },
    img3: {
      src: "/lookbook/parallax/7.jpg",
      className:
        "w-[240px] h-[305px] sm:w-[290px] md:w-[360px] lg:w-[360px] xl:w-[400px] 2xl:w-[460px] sm:h-[355px] md:h-[458px] lg:h-[458px] xl:h-[509px] 2xl:h-[585px]",
      position: { left: "20%", sm: "25%", xl: "363px" },
      zIndex: 3,
    },
    img4: {
      src: "/lookbook/parallax/6.jpg",
      className:
        "w-[240px] sm:w-[305px] md:w-[360px] lg:w-[360px] xl:w-[400px] 2xl:w-[460px] sm:h-[426px] md:h-[550px] lg:h-[550px] xl:h-[611px] 2xl:h-[702px]",
      position: { left: "2.5%", sm: "5%", xl: "40px" },
      zIndex: 3,
    },
    img5: {
      src: "/lookbook/parallax/3.jpg",
      className:
        "w-[240px] sm:w-[270px] md:w-[360px] lg:w-[360px] xl:w-[400px] 2xl:w-[452px] sm:h-[375px] md:h-[458px] lg:h-[458px] xl:h-[509px] 2xl:h-[577px]",
      position: { right: "10px", sm: "10%", xl: "137px" },
      zIndex: 2,
    },
  }

  return (
    <Container
      className="-mt-[70vh] relative w-full h-[600vh] "
      ref={containerRef}
    >
      <div className="sticky z-10 top-0 left-0 w-full h-screen flex items-center justify-center">
        <motion.div
          style={{ opacity: firstTextOpacity }}
          className="absolute w-full"
        >
          <div className="absolute inset-0 flex items-center justify-center ">
            <svg width="60vw" height="300" className="opacity-50 blur-3xl">
              <ellipse cx="30vw" cy="150" rx="30vw" ry="150" fill="black" />
            </svg>
          </div>
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
            <div className="absolute inset-0 flex items-center justify-center ">
              <svg width="60vw" height="300" className="opacity-50 blur-3xl">
                <ellipse cx="30vw" cy="150" rx="30vw" ry="150" fill="black" />
              </svg>
            </div>
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
          const yMotion = [y1, y2, y3, y4, y5][index]

          return (
            <motion.div
              key={key}
              style={{
                y: yMotion,
                zIndex: img.zIndex,
                position: "absolute",
                ...img.position,
              }}
            >
              <Image
                alt="image"
                src={img.src}
                className={`rounded-[20px] object-cover ${img.className}`}
                width={1000}
                height={1000}
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
