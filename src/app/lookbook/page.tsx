"use client"
import Footer from "@/components/layout/footer"
import ImageParallax from "../../components/visual/lookbook/image-parallax"
import FooterSlider from "@/components/visual/lookbook/footer-slide"
import Hero from "@/components/visual/lookbook/hero"

function Lookbook() {
  return (
    <div className="flex flex-col relative items-center justify-center ">
      {/* <CursorGlowEffect /> */}
      <Hero />
      <ImageParallax />
      <FooterSlider />
    </div>
  )
}

export default Lookbook
