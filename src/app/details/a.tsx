"use client"

import BigAnimation from "@/components/big-animation/BigAnimation"
import ImagesLookbook from "./ImagesLookbook"
import BottomParallax from "./bottomParallax"
import { useEffect, useState } from "react"

function DetailsPage() {
  const [fixedHeight, setFixedHeight] = useState(0) // Устанавливаем начальное значение в 0

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight // Получаем высоту окна
      setFixedHeight(height) // Устанавливаем фиксированное значение
      console.log("Обновленная высота:", height) // Отладочное сообщение
    }

    handleResize() // Устанавливаем высоту при первом рендере
    // window.addEventListener("resize", handleResize) // Добавляем обработчик события изменения размера

    return () => {
      window.removeEventListener("resize", handleResize) // Убираем обработчик при размонтировании
    }
  }, [])

  return (
    <div className="bg-[#0d0d0d] -mt-[85px]">
      <BigAnimation height={fixedHeight} />
      <BottomParallax />
      <ImagesLookbook />
    </div>
  )
}

export default DetailsPage
