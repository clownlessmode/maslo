import { VisualElementTemperature } from "@/components/visual/details"
import Container from "@/components/layout/container"
import { VisualElementBefore } from "@/components/visual/details"
import React from "react"

const Temperature = () => {
  return (
    <Container className="flex flex-col gap-5 justify-between md:pt-40 md:pb-20 pt-5 h-screen select-none pointer-events-none">
      <div className="flex justify-between flex-col md:flex-row gap-3 ">
        <p className="2xl:leading-[36px] xl:leading-[36px] lg:leading-[36px] md:leading-[42px] sm:leading-[42px] leading-[26px] max-w-none uppercase text-white text-[24px] sm:text-[42px] tracking-[-0.04em]  lg:text-4xl md:max-w-[520px]">
          Какой у него температурный режим - ответь, бро?
        </p>
        <p className="2xl:leading-[36px] md:text-left text-right lg:block md:hidden sm:block xl:leading-[36px] lg:leading-[36px] md:leading-[42px] sm:leading-[42px] leading-[26px] max-w-none uppercase text-white text-[24px] sm:text-[42px] tracking-[-0.04em] lg:text-4xl md:max-w-[520px]">
          Ведь он не любит <br className="block md:hidden" /> холод,
          <br className="lg:block hidden" />{" "}
          <span className="font-semibold">ему лишь бы</span>
        </p>
      </div>
      <div className="flex justify-between h-full gap-20">
        <div className="max-w-[1/2]">
          <VisualElementBefore className="max-h-[171px] sm:max-h-[275px] lg:max-h-[90vh] md:w-fit lg:w-full" />
        </div>
        <div className="flex flex-col gap-5 max-w-[1/2] items-end">
          <VisualElementTemperature className="max-h-[171px] sm:max-h-[275px] lg:max-h-[90vh] md:w-fit lg:w-full" />
          <p className="lg:hidden md:block hidden 2xl:leading-[36px] text-right xl:leading-[36px] lg:leading-[36px] md:leading-[42px] sm:leading-[42px] leading-[26px] max-w-[269px] uppercase text-white text-[24px] sm:text-[42px] tracking-[-0.04em] sm:max-w-[587px] lg:text-4xl lg:max-w-[820px]">
            Ведь он не любит холод,{" "}
            <span className="font-semibold">ему лишь бы</span>
          </p>
        </div>
      </div>
    </Container>
  )
}

export default Temperature

// <Container className="justify-between -space-y-0 relative flex flex-row md:mt-40 h-screen select-none pointer-events-none">
//   <div className="gap-y-[43px] flex flex-col">
//     <p className="2xl:leading-[36px] xl:leading-[36px] lg:leading-[36px] md:leading-[42px] sm:leading-[42px] leading-[26px] max-w-[269px] uppercase text-white text-[24px] sm:text-[42px] tracking-[-0.04em] sm:max-w-[487px] lg:text-4xl lg:max-w-[520px]">
//       Какой у него температурный режим - ответь, бро?
//     </p>
//     <VisualElementBefore className="max-w-[100px] sm:max-w-[158px] lg:max-w-none" />
//   </div>
//   <div className="gap-y-8 sm:gap-y-10 lg:gap-y-[37px] items-end flex flex-col z-[5]">
//     <p className="2xl:leading-[36px] min-h-[108px] xl:leading-[36px] lg:leading-[36px] md:leading-[42px] sm:leading-[42px] leading-[26px] text-[24px] order-1 sm:text-[42px] lg:text-4xl text-end uppercase">
//       Ведь он не любит холод,
//       <br /> <span className="font-semibold">ему лишь бы</span>
//     </p>
//     <VisualElementTemperature className="max-w-[171px] sm:max-w-[275px] lg:max-w-none order-1 lg:order-2" />
//   </div>
// </Container>
