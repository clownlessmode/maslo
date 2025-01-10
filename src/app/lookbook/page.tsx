"use client"

import Container from "@/components/layout/container"
import CursorGlowEffect from "@/components/visual/glow-cursor"
import { motion, useScroll, useTransform } from "framer-motion"
import Lenis from "lenis"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import ImageParallax from "../../components/visual/lookbook/image-parallax"
import FooterSlider from "@/components/visual/lookbook/footer-slide"
import Hero from "@/components/visual/lookbook/hero"

function Lookbook() {
  return (
    <div className="flex flex-col relative items-center justify-center -mt-[83px]">
      <CursorGlowEffect />
      <Hero />
      <ImageParallax />
      <FooterSlider />
    </div>
  )
}

export default Lookbook
