import { cn } from "@/utils"
import { useScroll, useTransform, motion, MotionValue } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface WordProps {
  children: string
  progress: any
  range: [number, number]
}

interface CharProps extends WordProps {}

interface ParagraphProps {
  paragraph: string
  containerProgress?: MotionValue<number>
  className?: string
}

export function Paragraph({
  paragraph,
  containerProgress,
  className,
}: ParagraphProps) {
  const container = useRef(null)
  const [hasReachedMax, setHasReachedMax] = useState(false)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  })

  const stickyProgress = useTransform(scrollYProgress, [0, 1], [1, 1], {
    clamp: true,
  })

  // Move useTransform outside the conditional
  const progress = useTransform(
    [stickyProgress, containerProgress || stickyProgress] as const,
    ([scroll, container]) => Math.min(scroll * container, 1)
  )

  // Reset hasReachedMax when container opacity approaches 0
  useEffect(() => {
    if (!containerProgress) return

    const unsubscribe = containerProgress.on("change", (latest) => {
      if (latest < 0.1) {
        setHasReachedMax(false)
      }
    })

    return () => unsubscribe()
  }, [containerProgress])

  const words = paragraph.split(" ")

  return (
    <p
      ref={container}
      className={cn("flex flex-wrap text-4xl uppercase text-white", className)}
    >
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={i} progress={progress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Char({ children, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0, 1], {
    clamp: true, // Ensure opacity doesn't reverse
  })

  return (
    <span>
      <span className={cn("absolute opacity-20")}>{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

function Word({ children, progress, range }: WordProps) {
  const amount = range[1] - range[0]
  const step = amount / children.length

  return (
    <span className="relative ml-1.5 mt-1.5">
      {children.split("").map((char, i) => {
        const start = range[0] + i * step
        const end = range[0] + (i + 1) * step
        return (
          <Char key={`c_${i}`} progress={progress} range={[start, end]}>
            {char}
          </Char>
        )
      })}
    </span>
  )
}
