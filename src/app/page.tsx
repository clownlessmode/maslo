"use client"

import dynamic from "next/dynamic"
import ThreeDModel from "./_mainpage/3DModel"
import WarmAs from "./_mainpage/WarmAs"
import CheckDetails from "./_mainpage/CheckDetails"
import Price from "./_mainpage/Price"
function HomePage() {
  return (
    <div className="flex md:flex-row flex-col-reverse w-full gap-2 md:gap-5 px-10 pb-[calc(66px+80px)] py-[66px] h-full">
      <div className="flex flex-col md:w-1/2 w-full h-full gap-2 md:gap-5">
        <div className=" flex flex-row h-full gap-2 md:gap-5">
          <WarmAs />
        </div>
        <div className="flex flex-row h-full gap-2 md:gap-5 max-h-[35%]">
          <CheckDetails />
          <Price />
        </div>
      </div>
      <div className="flex flex-col md:w-1/2 w-full h-full">
        <ThreeDModel />
      </div>
    </div>
  )
}

export default HomePage
// <main className="md:py-[66px] py-5 md:max-h-[calc(100vh-80px)] md:h-full flex flex-col">
// <Container className="h-full md:py-[66px] py-5 md:max-h-[calc(100vh-80px)] md:h-fit flex flex-col">
// <div className="bg-green-400 flex flex-col">
//   <WarmAs />
//   <div className="bg-red-400 flex flex-row">
//     <CheckDetails />
//     <Price />
//   </div>
// </div>
{
  /* <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5 lg:*:max-h-[860px]"> */
}
{
  /* <ThreeDModel /> */
}

{
  /* <div className="order-3 h-full col-span-1 min-h-[135px] sm:min-h-none md:col-span-2 grid grid-cols-2 gap-4 md:gap-5">
   
      </div> */
}
{
  /* </div> */
}
// </Container>
// </main>
