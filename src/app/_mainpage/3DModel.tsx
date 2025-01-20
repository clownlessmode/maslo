import React from "react"
import dynamic from "next/dynamic"
// const ModelViewer = dynamic(() => import("@/components/visual/3d/model"), {
//   ssr: false,
// })
const ThreeDModel = () => {
  return (
    <div
      className="order-first lg:order-2 md:col-span-2 md:row-span-3
            items-end justify-center flex 
            bg-background-100
            overflow-hidden
            h-full
            rounded-[30px] sm:w-[calc(100vw-80px)] sm:h-[calc(100vw-80px)] md:w-full md:h-full md:rounded-[60px] min-h-[150px] min-w-[305px]"
    >
      {/* <ModelViewer key={1} /> */}

      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        className="w-full h-full object-cover min-w-[300px] min-h-[300px] rounded-[30px] overflow-hidden"
      >
        <source src="/assets/loops.mp4" type="video/mp4" />
        <source src="/assets/loops.webm" type="video/webm" />
      </video>
    </div>
  )
}

export default ThreeDModel
