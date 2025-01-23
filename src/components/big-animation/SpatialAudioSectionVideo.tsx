"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import {
  VisualElementHeading,
  VisualElementHeadingSm,
} from "@/components/visual/details"
import Container from "@/components/layout/container"
import { AnimatePresence } from "framer-motion"
import ProductForm from "@/components/product-form"
import LoadingScreen from "./LoadingScreen"
import Temperature from "./content/Temperature"

const SpatialAudioSectionVideo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const progress = useMotionValue(0) // Изменено на useMotionValue
  const TOTAL_FRAMES = 1501

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current

    if (!video || !container) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const containerHeight = container.scrollHeight - window.innerHeight
      const newProgress = scrollTop / containerHeight

      // Клемпим прогресс между 0 и 1
      const clampedProgress = Math.max(0, Math.min(1, newProgress))

      // Устанавливаем время видео в зависимости от прогресса скролла
      video.currentTime = clampedProgress * video.duration
      progress.set(clampedProgress) // Обновлено на progress.set
    }

    window.addEventListener("scroll", handleScroll)

    // Убираем загрузочный экран после загрузки метаданных видео
    video.onloadedmetadata = () => {
      setIsLoading(false)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Функции для opacity с использованием прогресса
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
        {isLoading && <LoadingScreen progress={0} />}
      </AnimatePresence>
      <section ref={containerRef} className="h-[1800vh]">
        <div className="sticky top-0">
          <video
            ref={videoRef}
            src="/assets/scroll-sequence.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
          />

          {/* Начальный контейнер */}

          <motion.div style={{ opacity: container2Opacity }}>
            <Container className="flex flex-col gap-y-5 sm:gap-y-[30px] items-center lg:items-start lg:gap-y-[43px] justify-center h-screen bg-[black]/50 lg:bg-[black]/0">
              <span className="text-[36px] lg:text-[149px] sm:text-[60px] sm:leading-[60px] text-center lg:text-start font-semibold leading-[36px] lg:leading-[149px] tracking-[-0.04em]">
                <span className="text-brand">PEACH</span> <br />
                ЭФФЕКТ
              </span>
              <p className="max-w-[300px] sm:text-[24px] sm:max-w-[491px] text-center lg:text-start lg:max-w-[650px] uppercase text-[14px] lg:text-4xl text-white">
                Вы останетесь сухими и в безопасности даже в непогоду
              </p>
            </Container>
          </motion.div>

          <motion.div style={{ opacity: container3Opacity }}>
            <Container className="flex flex-col relative h-screen w-full justify-center items-end gap-y-2.5 lg:gap-y-[26px] bg-gradient-to-l">
              <div className="flex flex-col gap-y-2.5 lg:gap-y-[26px] sm:gap-y-5 lg:pr-[48px]">
                <span className="text-[36px] leading-[36px] sm:text-[60px] sm:leading-[60px] lg:text-[149px] font-semibold text-brand lg:leading-[149px] tracking-[-0.04em]">
                  BUTTER
                </span>
                <p className="text-4xl uppercase sm:text-[24px] sm:leading-[29px] sm:max-w-[300px] text-ellipsis lg:text-start lg:max-w-[650px] leading-[17px] text-[14px] lg:text-4xl text-white">
                  <span className="font-semibold">Сливочная эстетика:</span>
                  <br /> узнаваемый шеврон бренда.
                </p>
              </div>
              <div className="flex items-center [@media(min-width:1360px)]:w-[68vw] [@media(min-width:1460px)]:w-[66vw] w-[66vw]">
                <div className="rounded-full bg-white md:p-[11px] p-[4px]">
                  <div className="md:size-[18px] size-[8px] rounded-full bg-brand shadow shadow-brand" />
                </div>
                <div className="relative w-full h-[1px] bg-white" />
              </div>
            </Container>
          </motion.div>

          <motion.div style={{ opacity: container4Opacity }}>
            <Container className="pt-[150px] lg:pt-[200px]">
              <p className="lg:text-4xl lg:max-w-[870px] text-[14px] max-w-[343px] sm:text-[24px] sm:max-w-[601px] uppercase">
                А металлическая молния с гравированным логотипом? Она не только
                надежно держит всё вместе, но и добавляет стильный штрих, чтобы
                вы выглядели круче, чем ваш будильник в понедельник утром!
              </p>
            </Container>
          </motion.div>

          <motion.div style={{ opacity: container5Opacity }}>
            <Container className="h-screen pt-[180px] sm:pt-0 flex md:justify-center justify-end md:pb-0 pb-[180px] items-end pr-[36px] flex-col bg-gradient-to-b">
              <div className="flex flex-col gap-y-5 sm:gap-y-[30px] lg:gap-y-[37px]">
                <span className="text-[36px] leading-[36px] sm:text-[60px] sm:leading-[60px] lg:text-[149px] font-semibold text-brand lg:leading-[149px] tracking-[-0.04em]">
                  A CREAMY <br /> SURPRISE
                </span>
                <p className="lg:text-4xl lg:max-w-[827px] text-[14px] max-w-[325px] sm:text-[24px] sm:max-w-[595px] uppercase">
                  Как тебе моя уютная обёртка? Я сливочное масло, здесь, чтобы
                  убедиться, что ты не замерзаешь, а только греешься от смеха
                </p>
              </div>
            </Container>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default SpatialAudioSectionVideo
