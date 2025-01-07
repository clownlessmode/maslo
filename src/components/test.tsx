import { motion, MotionValue, useTransform } from "framer-motion"
import { useMemo, useRef, useEffect } from "react"
import {
  VisualElementBefore,
  VisualElementHeading,
  VisualElementTemperature,
} from "@/components/visual/details"
import useScrollImageSequenceFramerCanvas from "@/hooks/useScrollImageSequenceFramerCanvas"
import Container from "@/components/layout/container"
import { Paragraph } from "./ui/word"
import Lenis from "lenis"

const createImage = (src: string) => {
  const img = document.createElement("img")
  img.src = src
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

const SpatialAudioSection = () => {
  const TOTAL_FRAMES = 1501

  const keyframes = useMemo(() => {
    const isMobile =
      typeof window !== "undefined" ? window.innerWidth <= 744 : false
    const folderPath = isMobile ? "seqm" : "seq"

    return [...new Array(TOTAL_FRAMES)].map((_, i) => {
      const fileName = isMobile
        ? `k_${i.toString().padStart(5, "0")}.jpg`
        : `${i.toString().padStart(4, "0")}.jpg`

      return createImage(`${folderPath}/${fileName}`)
    })
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
    <section ref={containerRef} className="h-[2000vh]">
      <div className="sticky top-0">
        <canvas ref={canvasRef} className="absolute inset-0 pt-[84px] block" />
        <SequenceContainer opacity={container1Opacity}>
          <Container className="lg:justify-between justify-center -space-y-[93px] sm:-space-y-[140px] lg:-space-y-0 relative flex lg:flex-row flex-col mt-40 h-screen select-none pointer-events-none">
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
            <div className="flex items-center w-[75%]">
              <div className="rounded-full bg-white p-[11px]">
                <div className="size-[18px] rounded-full bg-brand shadow shadow-brand" />
              </div>
              <div className="relative w-full h-[1px] bg-white" />
            </div>
          </Container>
        </SequenceContainer>
        <SequenceContainer opacity={container4Opacity}>
          <Container className="h-screen lg:pt-[200px]">
            <p className="lg:text-4xl lg:max-w-[870px] text-[14px] max-w-[343px] sm:text-[24px] sm:max-w-[601px] uppercase">
              А металлическая молния с гравированным логотипом? Она не только
              надежно держит всё вместе, но и добавляет стильный штрих, чтобы вы
              выглядели круче, чем ваш будильник в поContainer утром!
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
