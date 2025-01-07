"use client"

import Container from "@/components/layout/container"
import CursorGlowEffect from "@/components/visual/glow-cursor"
import { motion, useScroll, useTransform } from "framer-motion"
import Lenis from "lenis"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import ImageParallax from "../../components/visual/lookbook/image-parallax"
import FooterSlider from "@/components/visual/lookbook/footer-slide"

interface ImageConfig {
  src: string
  alt: string
  className: string
  rotation: number
  marginRight: number
}

function ImageGroup({ images }: { images: ImageConfig[] }) {
  return (
    <div className="flex justify-center items-center absolute opacity-40">
      {images.map((image, index) => (
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: image.rotation }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index / 8 + 1 }}
          key={index}
          className={`${image.className} opacity-20`}
          style={{
            marginRight: image.marginRight,
            transform: `rotate(${image.rotation}deg)`,
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={351}
            height={500}
            className="rounded-[20px]"
            layout="responsive"
          />
        </motion.div>
      ))}
    </div>
  )
}

const imageConfigs: ImageConfig[] = [
  {
    src: "/lookbook/1.png",
    alt: "Image 1",
    className: "w-[198px]",
    marginRight: -55,
    rotation: -5.11,
  },
  {
    src: "/lookbook/2.png",
    alt: "Image 2",
    className: "w-[259px]",
    marginRight: -69,
    rotation: 7.35,
  },
  {
    src: "/lookbook/3.png",
    alt: "Image 3",
    className: "w-[310px]",
    marginRight: -164,
    rotation: -6.37,
  },
  {
    src: "/lookbook/4.png",
    alt: "Image 4",
    className: "w-[351px]",
    marginRight: -123,
    rotation: 8.54,
  },
  {
    src: "/lookbook/5.png",
    alt: "Image 5",
    className: "w-[259px]",
    marginRight: -64,
    rotation: 6.37,
  },
  {
    src: "/lookbook/6.png",
    alt: "Image 6",
    className: "w-[216px]",
    marginRight: -46,
    rotation: -7.35,
  },
  {
    src: "/lookbook/7.png",
    alt: "Image 7",
    className: "w-[162px]",
    marginRight: 0,
    rotation: 5.11,
  },
]

function Lookbook() {
  return (
    <div className="flex flex-col relative items-center justify-center -mt-[83px]">
      <CursorGlowEffect />
      <Container className="items-center relative min-h-screen flex justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, filter: "blur(24px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="w-full h-full absolute left-0 top-0"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #201A10 0%, #141414 100%)",
          }}
        />
        <motion.p
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl texst uppercase tracking-[-0.04em] leading-[18px] text-white/40 absolute left-10"
        >
          Look book
        </motion.p>
        <div className="flex flex-col items-center">
          <div className="overflow-clip z-[5]">
            <motion.h1
              initial={{ y: 250 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[60px] tracking-[-0.04em] uppercase leading-[66px] text-center z-[5]"
            >
              Ваш стиль, ваше заявление —
            </motion.h1>
          </div>
          <div className="overflow-clip z-[5]">
            <motion.h1
              initial={{ y: 250 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[60px] tracking-[-0.04em] uppercase leading-[66px] text-center z-[5]"
            >
              выберите{" "}
              <span className="font-semibold text-brand">MATTHEW MASLOV</span>
            </motion.h1>
          </div>
          <div className="overflow-clip z-[5]">
            <motion.h1
              initial={{ y: 250 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-[60px] tracking-[-0.04em] uppercase leading-[66px] text-center z-[5]"
            >
              и будьте в центре внимания
            </motion.h1>
          </div>
        </div>
        <ImageGroup images={imageConfigs} />
        <motion.p
          initial={{ x: 250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl tracking-[-0.04em] leading-[18px] text-white/40 absolute right-10"
        >
          MATTHEW MASLOV
        </motion.p>
        <svg
          className="absolute bottom-20"
          width="77"
          height="77"
          viewBox="0 0 77 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="38.5" cy="38.5" r="38.5" fill="#1A1A1A" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40.0001 42H44.1963L39.0001 51L33.804 42H38.0001L38.0001 26H40.0001L40.0001 42Z"
            fill="#BFBFBF"
          />
        </svg>
      </Container>
      <ImageParallax />
      <FooterSlider />
    </div>
  )
}

export default Lookbook
