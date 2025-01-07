"use client"

import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import VisualHomePageHeading from "@/components/visual/home-page-heading"
import photo from "../../public/home_page_girl.png"
import dynamic from "next/dynamic"
// const ModelViewer = dynamic(() => import("@/components/3d-model"), {
//   ssr: false,
// })
const ModelViewer = dynamic(() => import("@/components/visual/3d/model"), {
  ssr: false,
})
function HomePage() {
  return (
    <main className="py-4 md:py-[66px]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5 lg:*:max-h-[860px]">
          {/* Image - First on mobile, second on desktop */}
          <div
            className="order-first lg:order-2 md:col-span-2 md:row-span-3
            items-end justify-center flex bg-background-100
            rounded-[30px] md:rounded-[60px] xl:h-[860px] overflow-hidden h-full"
          >
            <ModelViewer key={1} />
          </div>

          {/* Heading - Second on mobile, first on desktop */}
          <div
            className="order-2 md:order-1 md:col-span-2 flex justify-center
            items-center md:row-span-2 bg-background-100 max-h-[176px] h-full sm:max-h-[10000px]
            rounded-[30px] md:rounded-[60px] px-5 md:p-6 xl:h-[521px]"
          >
            <VisualHomePageHeading />
          </div>

          {/* Button and Price container */}
          <div className="order-3 h-full col-span-1 min-h-[135px] sm:min-h-none md:col-span-2 grid grid-cols-2 gap-4 md:gap-5">
            <Button asChild size="lg" className="h-full w-full">
              <Link href="/details">CHECK DETAILS</Link>
            </Button>

            <div
              className="rounded-[20px] h-full md:rounded-[60px] bg-background-100
              text-md md:text-lg xl:text-2xl flex items-center justify-center
              font-semibold p-4 md:h-[319px]"
            >
              13.590 ₽
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}

export default HomePage
