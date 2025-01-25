import { VisualElementHeadingSm } from "@/components/visual/details/heading"
import Container from "@/components/layout/container"
import ProductForm from "@/components/product-form"
import { VisualElementHeading } from "@/components/visual/details/heading"
import React from "react"

const BottomParallax = ({
  secondFormRef,
}: {
  secondFormRef: React.RefObject<HTMLDivElement>
}) => {
  return (
    <Container className="flex pt-[150px] pb-[250px] flex-col items-center justify-center bg-[#0d0d0d] z-[999]">
      <div className="aspect-[1/1] max-w-[661px] overflow-hidden max-h-[661px] bg-background-100 rounded-[60px] w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          className="w-full h-full object-contain min-w-[300px] min-h-[300px]" // Изменено с object-cover на object-contain
        >
          <source src="/assets/loops.mp4" type="video/mp4" />
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
  )
}

export default BottomParallax
