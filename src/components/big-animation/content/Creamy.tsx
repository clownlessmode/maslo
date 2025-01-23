import Container from "@/components/layout/container"
import React from "react"

const Creamy = () => {
  return (
    <Container className="h-screen pt-[180px] sm:pt-0 flex md:justify-center justify-end md:pb-0 pb-[180px] md:items-end items-start pr-[36px] flex-col bg-gradient-to-b">
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
  )
}

export default Creamy
