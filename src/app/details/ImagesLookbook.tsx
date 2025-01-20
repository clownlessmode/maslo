import Container from "@/components/layout/container"
import React from "react"
import ImageCard from "./ImageCard"

const ImagesLookbook = () => {
  return (
    <Container className="grid lg:grid-cols-4 gap-[20px] grid-cols-2  bg-[#0d0d0d] pb-[100px]">
      {/* <ImageCard
        src={"bg-[url('/details/3.jpg')]"}
        size="lg"
        className="col-span-2 lg:hidden block"
        reverse
      /> */}
      <div className="flex lg:flex-col flex-row gap-[20px] lg:col-span-1 col-span-2">
        <ImageCard reverse src={"bg-[url('/details/1.jpg')]"} size="sm" />
        <ImageCard reverse src={"bg-[url('/details/2.jpg')]"} size="sm" />
      </div>
      <ImageCard
        src={"bg-[url('/details/3.jpg')]"}
        size="lg"
        className="col-span-2 block "
        reverse
      />
      <div className="flex lg:flex-col flex-row gap-[20px] lg:col-span-1 col-span-2">
        <ImageCard reverse src={"bg-[url('/details/4.jpg')]"} size="sm" />
        <ImageCard reverse src={"bg-[url('/details/5.jpg')]"} size="sm" />
      </div>
    </Container>
  )
}

export default ImagesLookbook
