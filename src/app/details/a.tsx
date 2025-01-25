// src/app/details/a.tsx
"use client"

import Container from "@/components/layout/container"
import { useEffect, useRef, useState } from "react"
import {
  VisualElementHeading,
  VisualElementHeadingSm,
} from "@/components/visual/details"
import ProductForm from "@/components/product-form"
import BigAnimation from "@/components/big-animation/BigAnimation"
import ImagesLookbook from "./ImagesLookbook"
import BottomParallax from "./bottomParallax"

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
      <div className="bg-blue-500 py-[150px]">
        <BigAnimation
          adaptiveBottom={adaptiveBottom}
          isSecondFormInView={isSecondFormInView}
        />
      </div>
      {/* <BottomParallax secondFormRef={secondFormRef} /> */}
      {/* <ImagesLookbook /> */}
      <div className="h-[1000px] bg-red-500">
        <p>text</p>
      </div>
    </div>
  )
}

export default DetailsPage
