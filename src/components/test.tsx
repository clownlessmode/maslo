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
import { Paragraph } from "./ui/word"
import Lenis from "lenis"
import { AnimatePresence } from "framer-motion"
const imageCache = new Map<string, HTMLImageElement>()

const createImage = (src: string) => {
  // Проверяем есть ли изображение в кеше
  if (imageCache.has(src)) {
    return imageCache.get(src)!
  }

  const img = document.createElement("img")
  img.src = src

  // Добавляем в кеш при успешной загрузке
  img.onload = () => {
    imageCache.set(src, img)
  }

  // Добавляем заголовки для кеширования
  fetch(src, {
    headers: {
      "Cache-Control": "max-age=31536000", // Кешировать на год
    },
  }).catch(console.error) // Игнорируем ошибки, так как изображение все равно загрузится через img.src

  return img
}

const handleDrawCanvas = (
  img: HTMLImageElement,
  ctx: CanvasRenderingContext2D
) => {
  const canvas = ctx.canvas
  const widthRatio = canvas.width / img.width
  const heightRatio = canvas.height / img.height
  const ratio = Math.max(widthRatio, heightRatio)
  const centerX = (canvas.width - img.width * ratio) / 2
  const centerY = (canvas.height - img.height * ratio) / 2
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerX,
    centerY,
    img.width * ratio,
    img.height * ratio
  )
}

interface FrameConfig {
  startFrame: number
  visibleFrame: number
  endFrame: number
}

const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-[#0d0d0d] z-[99999] flex items-center justify-center"
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: {
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
    >
      <div className="text-center">
        <div className="inline-block relative w-20 h-20 mb-4">
          <div className="absolute border-4 border-white/20 rounded-full w-full h-full" />
          <div
            className="absolute border-4 border-brand rounded-full w-full h-full animate-spin"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${progress}%)`,
            }}
          />
        </div>
        <motion.p
          className="text-white text-xl"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3 },
          }}
        >
          {Math.round(progress)}%
        </motion.p>
      </div>
    </motion.div>
  )
}

const SpatialAudioSection = () => {
  const TOTAL_FRAMES = 1501
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const keyframes = useMemo(() => {
    const isMobile =
      typeof window !== "undefined" ? window.innerWidth <= 744 : false
    const folderPath = isMobile ? "seqm-webp" : "seq-webp"
    let loadedImages = 0
    const startTime = performance.now()

    const frames = [...new Array(TOTAL_FRAMES)].map((_, i) => {
      const fileName = isMobile
        ? `k_${i.toString().padStart(5, "0")}.webp`
        : `${i.toString().padStart(4, "0")}.webp`

      const img = createImage(`${folderPath}/${fileName}`)

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
              <div className="xl:hidden block">
                <VisualElementHeadingSm />
              </div>
              <div className="w-full justify-between flex xl:pt-[40px]">
                <span className="text-white/40 text-[14px] xl:text-2xl text-nowrap">
                  MATTHEW MASLOV
                </span>
                <span className="text-white/40 text-[14px] xl:text-2xl text-nowrap">
                  DOWN JACKET
                </span>
              </div>
            </Container>
          </SequenceContainer>

          <SequenceContainer opacity={container1Opacity}>
            <Container className="lg:justify-between justify-center -space-y-[93px] sm:-space-y-[140px] lg:-space-y-0 relative flex lg:flex-row flex-col md:mt-40 h-screen select-none pointer-events-none">
              <div className="gap-y-[43px] flex flex-col">
                <p className="max-w-[269px] uppercase text-white text-[24px] sm:text-[42px] tracking-[-0.04em] sm:max-w-[487px] lg:text-4xl lg:max-w-[520px]">
                  Какой у него температурный режим - ответь, бро?
                </p>
                <VisualElementBefore className="max-w-[100px] sm:max-w-[158px] lg:max-w-none" />
              </div>
              <div className="gap-y-8 sm:gap-y-10 lg:gap-y-[37px] items-end flex flex-col z-[5]">
                <p className="text-[24px] order-2 lg:order-1 sm:text-[42px] lg:text-4xl text-end uppercase">
                  Ведь он не любит холод,
                  <br /> <span className="font-semibold">ему лишь бы</span>
                </p>
                <VisualElementTemperature className="max-w-[171px] sm:max-w-[275px] lg:max-w-none order-1 lg:order-2" />
              </div>
            </Container>
          </SequenceContainer>
          <SequenceContainer opacity={container2Opacity}>
            <Container className="flex flex-col gap-y-5 sm:gap-y-[30px] items-center lg:items-start lg:gap-y-[43px] justify-center h-screen ">
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
            <Container className="flex flex-col relative h-screen w-full justify-center items-end gap-y-2.5 lg:gap-y-[26px]">
              <div className="flex flex-col gap-y-2.5 lg:gap-y-[26px] sm:gap-y-5">
                <span className="text-[36px] leading-[36px] sm:text-[60px] sm:leading-[60px] lg:text-[149px] font-semibold text-brand lg:leading-[149px] tracking-[-0.04em]">
                  BUTTER
                </span>
                <p className="text-4xl uppercase sm:text-[24px] sm:leading-[29px] sm:max-w-[300px] text-ellipsis lg:text-start lg:max-w-[650px] leading-[17px] text-[14px] lg:text-4xl text-white">
                  <span className="font-semibold ">Сливочная эстетика:</span>
                  <br /> узнаваемый шеврон бренда.
                </p>
              </div>
              <div
                className="flex items-center 
    [@media(min-width:1360px)]:w-[68vw]
        [@media(min-width:1460px)]:w-[66vw]
    w-[66vw]
  "
              >
                <div className="rounded-full bg-white md:p-[11px] p-[4px]">
                  <div className="md:size-[18px] size-[8px] rounded-full bg-brand shadow shadow-brand" />
                </div>
                <div className="relative w-full h-[1px] bg-white" />
              </div>
            </Container>
          </SequenceContainer>
          <SequenceContainer opacity={container4Opacity}>
            <Container className="pt-[150px] lg:pt-[200px]">
              <p className="lg:text-4xl lg:max-w-[870px] text-[14px] max-w-[343px] sm:text-[24px] sm:max-w-[601px] uppercase">
                А металлическая молния с гравированным логотипом? Она не только
                надежно держит всё вместе, но и добавляет стильный штрих, чтобы
                вы выглядели круче, чем ваш будильник в понедельник утром!
              </p>
            </Container>
          </SequenceContainer>
          <SequenceContainer opacity={container5Opacity}>
            <Container className="h-screen flex justify-center items-end pr-[36px] flex-col">
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
          </SequenceContainer>
        </div>
      </section>
    </>
  )
}

const App = () => (
  <main>
    <div className="overflow-clip">
      <SpatialAudioSection />
    </div>
  </main>
)

interface SequenceContainerProps {
  opacity: MotionValue<number>
  children: React.ReactNode
}

function SequenceContainer({ opacity, children }: SequenceContainerProps) {
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {children}
    </motion.div>
  )
}

export default App
