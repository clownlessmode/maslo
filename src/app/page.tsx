"use client"

import ThreeDModel from "./_mainpage/3DModel"
import WarmAs from "./_mainpage/WarmAs"
import CheckDetails from "./_mainpage/CheckDetails"
import Price from "./_mainpage/Price"
function HomePage() {
  return (
    <div className="flex md:flex-row flex-col-reverse w-full gap-2 md:gap-5 px-5 sm:px-10 md:pb-[calc(66px+80px)] md:py-[66px] pb-[calc(66px)]  h-full">
      <div className="flex flex-col md:w-1/2 w-full h-full gap-2 md:gap-5">
        <div className=" flex flex-row h-full gap-2 md:gap-5">
          <WarmAs />
        </div>
        <div className="flex flex-row h-full gap-2 md:gap-5 max-h-[35%]">
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
