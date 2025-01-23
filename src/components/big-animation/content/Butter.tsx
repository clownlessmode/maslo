import Container from "@/components/layout/container"
import React from "react"

const Butter = () => {
  return (
    <Container className="flex flex-col relative h-screen w-full justify-center items-end gap-y-2.5 lg:gap-y-[26px] bg-gradient-to-l">
      <div className="flex flex-col gap-y-2.5 lg:gap-y-[26px] sm:gap-y-5 lg:pr-[48px]">
        <span className="text-[36px] leading-[36px] sm:text-[60px] sm:leading-[60px] lg:text-[149px] font-semibold text-brand lg:leading-[149px] tracking-[-0.04em]">
          BUTTER
        </span>
        <p className="text-4xl uppercase sm:text-[24px] sm:leading-[29px] sm:max-w-[300px] text-ellipsis lg:text-start lg:max-w-[650px] leading-[17px] text-[14px] lg:text-4xl text-white">
          <span className="font-semibold ">Сливочная эстетика:</span>
          <br /> узнаваемый шеврон бренда.
        </p>
      </div>
      <div
        className="flex items-center 
    [@media(min-width:1360px)]:w-[68vw]
        [@media(min-width:1460px)]:w-[66vw]
    w-[80vw]
  "
      >
        <div className="rounded-full bg-white md:p-[11px] p-[4px]">
          <div className="md:size-[18px] size-[8px] rounded-full bg-brand shadow shadow-brand" />
        </div>
        <div className="relative w-full h-[1px] bg-white" />
      </div>
    </Container>
  )
}

export default Butter
