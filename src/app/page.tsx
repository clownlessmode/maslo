"use client"
import ThreeDModel from "./_mainpage/3DModel"
import WarmAs from "./_mainpage/WarmAs"
import CheckDetails from "./_mainpage/CheckDetails"
import Price from "./_mainpage/Price"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
function HomePage() {
  const [fixedHeight, setFixedHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight // Получаем высоту окна
      setFixedHeight(height - 50) // Устанавливаем фиксированное значение
    }

    handleResize() // Устанавливаем высоту при первом рендере
    window.addEventListener("resize", handleResize) // Добавляем обработчик события изменения размера

    return () => {
      window.removeEventListener("resize", handleResize) // Убираем обработчик при размонтировании
    }
  }, [])

  return (
    <div
      className={cn(
        "flex md:flex-row flex-col-reverse w-full gap-2 md:gap-5 px-5 sm:px-10 md:pb-[calc(66px+80px)] md:py-[66px] pb-[calc(66px)]   md:h-full",
        "md:max-h-[95dvh]",
        `h-[${fixedHeight}px]`
      )}
    >
      <div className="flex flex-col md:w-1/2 w-full md:h-full gap-2 md:gap-5 ">
        <div className="flex flex-row md:h-full gap-2 md:gap-5">
          <WarmAs />
        </div>
        <div className="flex flex-row md:h-full gap-2 md:gap-5 max-h-[35%]">
          <CheckDetails />
          <Price />
        </div>
      </div>
      <div className="flex flex-col md:w-1/2 w-full h-full overflow-hidden rounded-[30px]">
        <ThreeDModel />
      </div>
    </div>
  )
}

export default HomePage
