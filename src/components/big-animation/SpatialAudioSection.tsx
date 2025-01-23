"use client"

import { motion, MotionValue, useTransform } from "framer-motion"
import { useMemo, useRef, useEffect, useState } from "react"
import {
  VisualElementBefore,
  VisualElementHeading,
  VisualElementHeadingSm,
  VisualElementTemperature,
} from "@/components/visual/details"
import useScrollImageSequenceFramerCanvas from "@/hooks/useScrollImageSequenceFramerCanvas"
import Container from "@/components/layout/container"
import { AnimatePresence } from "framer-motion"
import ProductForm from "@/components/product-form"
import createImage from "./createImage"
import LoadingScreen from "./LoadingScreen"
import handleDrawCanvas from "./handleDrawCanvas"
import SequenceContainer from "./SequenceContainer"
import Temperature from "./content/Temperature"
import Butter from "./content/Butter"
import Molniya from "./content/Molniya"
import Creamy from "./content/Creamy"

const SpatialAudioSection = ({
  isSecondFormInView,
  adaptiveBottom,
}: {
  isSecondFormInView: boolean
  adaptiveBottom: number
}) => {
  const TOTAL_FRAMES = 1501
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const keyframes = useMemo(() => {
    if (typeof window === "undefined") return []

    const isMobile = window.innerWidth <= 744
    const folderPath = isMobile ? "seqm-webp" : "seq-webp"
    let loadedImages = 0
    const startTime = performance.now()

    const frames = [...new Array(TOTAL_FRAMES)].map((_, i) => {
      const fileName = isMobile
        ? `k_${i.toString().padStart(5, "0")}.webp`
        : `${i.toString().padStart(4, "0")}.webp`

      const img = createImage(`${folderPath}/${fileName}`, isMobile)

      const checkComplete = () => {
        loadedImages++
        const progress = (loadedImages / TOTAL_FRAMES) * 100
        setLoadingProgress(progress)
        console.log(`Loaded: ${loadedImages}/${TOTAL_FRAMES} (${progress}%)`)

        if (loadedImages >= TOTAL_FRAMES - 1) {
          const endTime = performance.now()
          const loadTime = (endTime - startTime) / 1000
          console.log(
            `Все изображения загружены за ${loadTime.toFixed(2)} секунд`
          )
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        }
      }

      img.onerror = () => {
        console.log(`Ошибка загрузки изображения ${fileName}`)
        checkComplete()
      }

      img.onload = () => {
        checkComplete()
      }

      return img
    })

    return frames
  }, [])

  const containerRef = useRef<HTMLElement>(null)
  const [progress, canvasRef] = useScrollImageSequenceFramerCanvas({
    onDraw: handleDrawCanvas,
    keyframes: keyframes,
    scrollOptions: {
      target: containerRef,
      offset: ["start", "end"],
    },
  })
  const initialContentOpacity = useTransform(
    progress,
    [0, 100 / TOTAL_FRAMES],
    [1, 0]
  )

  const [opacityValue, setOpacityValue] = useState(initialContentOpacity.get())

  useEffect(() => {
    const unsubscribe = initialContentOpacity.onChange((value) => {
      setOpacityValue(value)
    })

    return () => unsubscribe()
  }, [initialContentOpacity])

  useEffect(() => {
    console.log("progress изменился на:", progress)
  }, [progress])

  const container1Opacity = useTransform(
    progress,
    [188 / TOTAL_FRAMES, 250 / TOTAL_FRAMES, 362 / TOTAL_FRAMES],
    [0, 1, 0]
  )

  const container1tOpacity = useTransform(
    progress,
    [188 / TOTAL_FRAMES, 250 / TOTAL_FRAMES, 362 / TOTAL_FRAMES],
    [0, 1, 1]
  )

  const container2Opacity = useTransform(
    progress,
    [410 / TOTAL_FRAMES, 510 / TOTAL_FRAMES, 688 / TOTAL_FRAMES],
    [0, 1, 0]
  )

  const container2tOpacity = useTransform(
    progress,
    [410 / TOTAL_FRAMES, 510 / TOTAL_FRAMES, 688 / TOTAL_FRAMES],
    [0, 1, 1]
  )

  const container3Opacity = useTransform(
    progress,
    [766 / TOTAL_FRAMES, 840 / TOTAL_FRAMES, 900 / TOTAL_FRAMES],
    [0, 1, 0]
  )
  const container3tOpacity = useTransform(
    progress,
    [840 / TOTAL_FRAMES, 1000 / TOTAL_FRAMES, 1000 / TOTAL_FRAMES],
    [1, 1, 1]
  )

  const container4Opacity = useTransform(
    progress,
    [932 / TOTAL_FRAMES, 1000 / TOTAL_FRAMES, 1160 / TOTAL_FRAMES],
    [0, 1, 0]
  )

  const container4tOpacity = useTransform(
    progress,
    [932 / TOTAL_FRAMES, 1000 / TOTAL_FRAMES, 1180 / TOTAL_FRAMES],
    [0, 0, 1]
  )

  const container5Opacity = useTransform(
    progress,
    [1232 / TOTAL_FRAMES, 1300 / TOTAL_FRAMES, 1366 / TOTAL_FRAMES],
    [0, 1, 0]
  )
  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen progress={loadingProgress} />}
      </AnimatePresence>
      <section ref={containerRef} className="h-[1800vh]">
        <div className="sticky top-0">
          <canvas ref={canvasRef} className="absolute inset-0 block" />
          <SequenceContainer opacity={initialContentOpacity}>
            <Container className="absolute top-[60vh] left-0 w-full flex flex-col items-center">
              <div className="xl:block hidden">
                <VisualElementHeading />
              </div>
              <div className="xl:hidden flex flex-col gap-5">
                <VisualElementHeadingSm />
                <div className="flex justify-between w-full">
                  <motion.span
                    style={{ opacity: initialContentOpacity }}
                    className="text-white/40 text-[14px] xl:text-2xl text-nowrap"
                  >
                    MATTHEW MASLOV
                  </motion.span>
                  <motion.span
                    style={{ opacity: initialContentOpacity }}
                    className="text-white/40 text-[14px] xl:text-2xl text-nowrap"
                  >
                    DOWN JACKET
                  </motion.span>
                </div>
              </div>
            </Container>
          </SequenceContainer>
          <motion.div
            className="w-full px-5 sm:px-10 justify-center items-center max-w-full left-1/2 -translate-x-1/2  xl:pt-[40px] fixed z-[999] xl:hidden flex"
            initial={{ top: "70vh" }}
            animate={{
              top: initialContentOpacity.get() === 0 ? "85vh" : "80vh",
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-fit">
              <ProductForm />
              {/* {opacityValue} */}
            </div>
          </motion.div>
          <motion.div
            className="w-full px-5 sm:px-10 justify-between items-center xl:max-w-[1440px] left-1/2 -translate-x-1/2  xl:pt-[40px] z-[999] fixed xl:flex hidden"
            initial={{ top: "75vh" }}
            animate={{
              top: initialContentOpacity.get() === 0 ? "80vh" : "75vh",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              style={{ opacity: initialContentOpacity }}
              className="text-white/40 text-[14px] xl:text-2xl text-nowrap"
            >
              MATTHEW MASLOV
            </motion.span>
            <div className="w-fit">
              <ProductForm />
              {/* {opacityValue} */}
            </div>
            <motion.span
              style={{ opacity: initialContentOpacity }}
              className="text-white/40 text-[14px] xl:text-2xl text-nowrap"
            >
              DOWN JACKET
            </motion.span>
          </motion.div>
          <SequenceContainer opacity={container1Opacity}>
            <Temperature />
          </SequenceContainer>
          <SequenceContainer opacity={container2Opacity}>
            <Container className="flex flex-col gap-y-5 sm:gap-y-[30px] items-center lg:items-start lg:gap-y-[43px] justify-center h-screen bg-[black]/50 lg:bg-[black]/0">
              <span className="text-[36px] lg:text-[149px] sm:text-[60px] sm:leading-[60px] text-center lg:text-start font-semibold leading-[36px] lg:leading-[149px] tracking-[-0.04em]">
                <span className="text-brand">PEACH</span> <br />
                ЭФФЕКТ
              </span>
              <p className="max-w-[300px] sm:text-[24px] sm:max-w-[491px] text-center lg:text-start lg:max-w-[650px] uppercase text-[14px] lg:text-4xl text-white">
                Вы останетесь сухими и в безопасности даже в непогоду
              </p>
            </Container>
          </SequenceContainer>
          <SequenceContainer opacity={container3Opacity}>
            <Butter />
          </SequenceContainer>
          <SequenceContainer opacity={container4Opacity}>
            <Molniya />
          </SequenceContainer>
          <SequenceContainer opacity={container5Opacity}>
            <Creamy />
          </SequenceContainer>
        </div>
      </section>
    </>
  )
}

export default SpatialAudioSection
