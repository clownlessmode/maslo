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
import WarmAsFirst from "./content/WarmAsFirst"
import Peach from "./content/Peach"

const SpatialAudioSection = ({ height }: { height: number }) => {
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

  useEffect(() => {
    console.log("Progress:", progress.get())
  }, [progress])

  useEffect(() => {
    const unsubscribe = progress.onChange((value) => {
      console.log("Progress value:", value)
    })
    return () => unsubscribe()
  }, [progress])

  const initialContentOpacity = useTransform(
    progress,
    [0, 100 / TOTAL_FRAMES],
    [1, 0],
    { clamp: true }
  )

  const container1Opacity = useTransform(
    progress,
    [188 / TOTAL_FRAMES, 250 / TOTAL_FRAMES, 362 / TOTAL_FRAMES],
    [0, 1, 0],
    { clamp: true }
  )

  const container2Opacity = useTransform(
    progress,
    [410 / TOTAL_FRAMES, 510 / TOTAL_FRAMES, 688 / TOTAL_FRAMES],
    [0, 1, 0],
    { clamp: true }
  )

  const container3Opacity = useTransform(
    progress,
    [766 / TOTAL_FRAMES, 840 / TOTAL_FRAMES, 900 / TOTAL_FRAMES],
    [0, 1, 0],
    { clamp: true }
  )

  const container4Opacity = useTransform(
    progress,
    [932 / TOTAL_FRAMES, 1000 / TOTAL_FRAMES, 1160 / TOTAL_FRAMES],
    [0, 1, 0],
    { clamp: true }
  )

  const container5Opacity = useTransform(
    progress,
    [1232 / TOTAL_FRAMES, 1300 / TOTAL_FRAMES, 1366 / TOTAL_FRAMES],
    [0, 1, 0],
    { clamp: true }
  )
  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen progress={loadingProgress} />}
      </AnimatePresence>

      <section ref={containerRef} style={{ height: `${height * 18}px` }}>
        <div className="sticky top-0">
          <canvas ref={canvasRef} className="absolute inset-0 block" />

          <SequenceContainer opacity={initialContentOpacity}>
            <WarmAsFirst initialContentOpacity={initialContentOpacity} />
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
            <Peach />
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
