import Container from "@/components/layout/container"
import React from "react"

const Peach = () => {
  return (
    <Container className="flex flex-col gap-y-5 sm:gap-y-[30px] items-center lg:items-start lg:gap-y-[43px] justify-center h-screen bg-[black]/50 lg:bg-[black]/0">
      <span className="text-[36px] lg:text-[149px] sm:text-[60px] sm:leading-[60px] text-center lg:text-start font-semibold leading-[36px] lg:leading-[149px] tracking-[-0.04em]">
        <span className="text-brand">PEACH</span> <br />
        ЭФФЕКТ
      </span>
      <p className="max-w-[300px] sm:text-[24px] sm:max-w-[491px] text-center lg:text-start lg:max-w-[650px] uppercase text-[14px] lg:text-4xl text-white">
        Вы останетесь сухими и в безопасности даже в непогоду
      </p>
    </Container>
  )
}

export default Peach
