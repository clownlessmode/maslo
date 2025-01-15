// src/app/details/a.tsx
"use client"

import Container from "@/components/layout/container"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  VisualElementHeading,
  VisualElementHeadingSm,
} from "@/components/visual/details"
import { cn } from "@/utils"
import photo from "../../../public/home_page_girl.png"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowDownRight } from "lucide-react"
import ProductForm from "@/components/product-form"
import App from "@/components/test"
const ModelViewer = dynamic(() => import("@/components/visual/3d/model"), {
  ssr: false,
})

// Dynamically import ProductForm with SSR disabled if necessary

function DetailsPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSecondFormInView, setIsSecondFormInView] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const secondFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Проверяем наличие window только на клиенте
    if (typeof window !== "undefined") {
      // Инициализируем начальную ширину
      setWindowWidth(window.innerWidth)

      const handleScroll = () => {
        setIsScrolled(window.scrollY > 30)
      }

      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  useEffect(() => {
    if (secondFormRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsSecondFormInView(entry.isIntersecting)
          })
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        }
      )

      observer.observe(secondFormRef.current)

      return () => {
        if (secondFormRef.current) {
          observer.unobserve(secondFormRef.current)
        }
      }
    }
  }, [])

  // Адаптивное значение для bottom в зависимости от ширины экрана
  const adaptiveBottom =
    windowWidth > 768 ? (isScrolled ? 80 : 250) : isScrolled ? -5 : -5
  return (
    <div className="pb-[100px] bg-[#0d0d0d] -mt-[85px]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col relative mx-auto justify-center items-center gap-y-[30px] -mt-[85px]">
          <AnimatePresence>
            {!isSecondFormInView && (
              <motion.div
                className={cn(
                  "justify-center flex fixed z-[100] flex-col items-center gap-[30px]",
                  {
                    hidden: isSecondFormInView,
                  }
                )}
                initial={{ bottom: -30 }}
                animate={{ opacity: 1, y: -15, bottom: adaptiveBottom }}
                transition={{
                  duration: 0.25,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1,
                  bounce: 0.25,
                  ease: [0.77, 0, 0.175, 1],
                }}
              >
                <ProductForm />
                {/* {!isScrolled && (
                  <span className="text-white/40 text-[14px] xl:text-2xl flex items-center flex-row">
                    MORE <ArrowDownRight />
                  </span>
                )} */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <App />
      <Container className="flex py-[250px] flex-col items-center justify-center bg-[#0d0d0d] z-[999]">
        <div className="aspect-[4/3] max-w-[910px] max-h-[661px] bg-background-100 rounded-[60px] w-full h-full">
          <ModelViewer key={3} />
        </div>
        <div
          ref={secondFormRef}
          className="flex flex-col relative mx-auto justify-center items-center lg:gap-y-[30px] md:gap-y-[15px] gap-y-[10px] -mt-[85px] w-full"
        >
          <div className="hidden lg:block">
            <VisualElementHeading />
          </div>
          <div className="inherit lg:hidden">
            <VisualElementHeadingSm className="" />
          </div>
          <div className="w-full justify-between flex lg:pt-[40px] pt-[5px] gap-6">
            <span className="text-white/40 lg:text-2xl md:text-xl sm:text-lg text-md">
              MATTHEW MASLOV
            </span>
            <span className="text-white/40 lg:text-2xl md:text-xl sm:text-lg text-md">
              DOWN JACKET
            </span>
          </div>
          <div className="absolute translate-x-50% lg:-bottom-[40px] -bottom-[120px] z-50 ">
            <ProductForm />
          </div>
        </div>
      </Container>
      <Container className="grid xl:grid-cols-4 gap-5">
        <ImageCard
          src={"bg-[url('/details/1.png')]"}
          size="lg"
          className="col-span-2"
          reverse
        />
        <div className="flex flex-col gap-y-10 items-center">
          <ImageCard src={"bg-[url('/details/2.png')]"} size="sm" />
          <ImageCard
            src={"bg-[url('/details/3.png')]"}
            size="sm"
            className="xl:!size-[18.073vw] h-auto size-[100%] px-[60px]"
          />
        </div>
        <div className="flex flex-col xl:mt-[60px] gap-y-10 items-center">
          <ImageCard
            src={"bg-[url('/details/4.png')]"}
            size="sm"
            className="xl:!size-[18.073vw] h-auto size-[100%] px-[60px]"
          />
          <ImageCard src={"bg-[url('/details/5.png')]"} size="sm" />
        </div>
      </Container>
    </div>
  )
}

interface ImageCardProps {
  src: string
  size: "sm" | "lg"
  reverse?: boolean
  className?: string
}

const ImageCard: React.FC<ImageCardProps> = ({
  src,
  size = "lg",
  reverse = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative w-full rounded-[40px] bg-background-100 overflow-hidden group",
        className,
        size === "sm"
          ? "xl:size-[24.219vw] size-[42vw]"
          : "lg:h-[100%] h-[50vh]"
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center rounded-[40px]">
        <div
          className={cn(
            "bg-cover bg-center transition-all duration-300 rounded-[40px]",
            src,
            reverse
              ? "w-full h-full group-hover:w-4/5  group-hover:h-4/5"
              : "w-4/5 h-4/5  group-hover:w-full group-hover:h-full"
          )}
        />
      </div>
    </div>
  )
}

export default DetailsPage
