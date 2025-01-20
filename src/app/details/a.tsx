// src/app/details/a.tsx
"use client"

import Container from "@/components/layout/container"
import { useEffect, useRef, useState } from "react"
import {
  VisualElementHeading,
  VisualElementHeadingSm,
} from "@/components/visual/details"
import { cn } from "@/utils"
import dynamic from "next/dynamic"
import ProductForm from "@/components/product-form"
import BigAnimation from "@/components/big-animation/BigAnimation"
import ImagesLookbook from "./ImagesLookbook"

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
    <div className=" bg-[#0d0d0d] -mt-[85px]">
      <BigAnimation
        adaptiveBottom={adaptiveBottom}
        isSecondFormInView={isSecondFormInView}
      />
      <Container className="flex pt-[150px] pb-[250px] flex-col items-center justify-center bg-[#0d0d0d] z-[999]">
        <div className="aspect-[1/1] max-w-[661px] overflow-hidden max-h-[661px] bg-background-100 rounded-[60px] w-full h-full">
          {/* <ModelViewer key={3} /> */}
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="w-full h-full object-contain min-w-[300px] min-h-[300px]" // Изменено с object-cover на object-contain
          >
            <source src="/assets/loops.mp4" type="video/mp4" />
            <source src="/assets/loops.webm" type="video/webm" />
          </video>
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
          <div className="w-full justify-between flex lg:pt-[40px] pt-[5px] gap-6 max-w-[1474px]">
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
      <ImagesLookbook />
    </div>
  )
}

export default DetailsPage
