import Container from "@/components/layout/container"
import React from "react"

const Molniya = () => {
  return (
    <Container className="h-screen pt-[180px] sm:pt-0 flex pb-[200px] justify-end items-start pr-[36px] flex-col bg-gradient-to-b">
      <div className="flex flex-col gap-y-5 sm:gap-y-[30px] lg:gap-y-[37px]">
        <p className="text-[36px] leading-[36px] sm:text-[48px] sm:leading-[48px] lg:text-[80px] font-semibold text-white lg:leading-[80px] tracking-[-0.04em]">
          А МЕТАЛЛИЧЕСКАЯ
          <br />
          МОЛНИЯ С<br />
          <span className="text-[36px] leading-[36px] sm:text-[48px] sm:leading-[48px] lg:text-[80px] font-semibold text-brand lg:leading-[80px] tracking-[-0.04em]">
            ГРАВИРОВАННЫМ
            <br />
            ЛОГОТИПОМ?
          </span>
        </p>

        <p className="lg:text-4xl lg:max-w-[827px] text-[14px] max-w-[325px] sm:text-[24px] sm:max-w-[595px] uppercase leading-tight">
          Она не только надежно держит всё вместе, но и добавляет стильный
          штрих, чтобы вы выглядели круче, чем ваш будильник в понедельник
          утром!
        </p>
      </div>
    </Container>
  )
}

export default Molniya
