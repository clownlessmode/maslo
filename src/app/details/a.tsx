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
// const ModelViewer = dynamic(() => import("@/components/3d-model"), {
//   ssr: false,
// })
const ModelViewer = dynamic(() => import("@/components/visual/3d/model"), {
  ssr: false,
})
// Dynamically import App with SSR disabled
const App = dynamic(() => import("@/components/test"), { ssr: false })

// Dynamically import ProductForm with SSR disabled if necessary
const ProductForm = dynamic(() => import("@/components/product-form"), {
  ssr: false,
})

function DetailsPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSecondFormInView, setIsSecondFormInView] = useState(false)
  const secondFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

  return (
    <div className="pt-[26px] pb-[100px] bg-[#0d0d0d]">
      <Container className="flex flex-col items-center justify-center">
        <div className="aspect-[4/3] max-w-[910px] max-h-[661px] bg-background-100 rounded-[60px] w-full h-full">
          <ModelViewer key={2} />
        </div>

        <div className="flex flex-col relative mx-auto justify-center items-center gap-y-[30px] -mt-[85px]">
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
                animate={{ bottom: isScrolled ? 80 : 250 }}
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
      </Container>
      <App />
      <Container className="flex py-[250px] flex-col items-center justify-center bg-[#0d0d0d] z-[999]">
        <div className="aspect-[4/3] max-w-[910px] max-h-[661px] bg-background-100 rounded-[60px] w-full h-full">
          <ModelViewer key={3} />
        </div>
        <div
          ref={secondFormRef}
          className="flex flex-col relative mx-auto justify-center items-center gap-y-[30px] -mt-[85px]"
        >
          <VisualElementHeading />
          <div className="w-full justify-between flex pt-[40px]">
            <span className="text-white/40 text-2xl">MATTHEW MASLOV</span>
            <span className="text-white/40 text-2xl">DOWN JACKET</span>
          </div>
          <div className="absolute translate-x-50% -bottom-[40px]">
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
