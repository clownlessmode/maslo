import Container from "@/components/layout/container"
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
interface ImageConfig {
  src: string
  alt: string
  className: string
  rotation: number
  marginRight: number
}

function ImageGroup({ images }: { images: ImageConfig[] }) {
  return (
    <div className="flex justify-center items-center absolute opacity-40 rotate-[-20deg] sm:rotate-[-15deg] md:rotate-[-10deg] lg:rotate-[-5deg] xl:rotate-[0deg]">
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
    className: "w-[120px] sm:w-[150px] md:w-[175px] lg:w-[198px]",
    marginRight: -55,
    rotation: -5.11,
  },
  {
    src: "/lookbook/2.png",
    alt: "Image 2",
    className: "w-[160px] sm:w-[200px] md:w-[230px] lg:w-[259px]",
    marginRight: -69,
    rotation: 7.35,
  },
  {
    src: "/lookbook/3.png",
    alt: "Image 3",
    className: "w-[180px] sm:w-[230px] md:w-[270px] lg:w-[310px]",
    marginRight: -164,
    rotation: -6.37,
  },
  {
    src: "/lookbook/4.png",
    alt: "Image 4",
    className: "w-[200px] sm:w-[260px] md:w-[300px] lg:w-[351px]",
    marginRight: -123,
    rotation: 8.54,
  },
  {
    src: "/lookbook/5.png",
    alt: "Image 5",
    className: "w-[160px] sm:w-[200px] md:w-[230px] lg:w-[259px]",
    marginRight: -64,
    rotation: 6.37,
  },
  {
    src: "/lookbook/6.png",
    alt: "Image 6",
    className: "w-[130px] sm:w-[170px] md:w-[190px] lg:w-[216px]",
    marginRight: -46,
    rotation: -7.35,
  },
  {
    src: "/lookbook/7.png",
    alt: "Image 7",
    className: "w-[100px] sm:w-[130px] md:w-[145px] lg:w-[162px]",
    marginRight: 0,
    rotation: 5.11,
  },
]
const Hero = () => {
  return (
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
      <div className="flex flex-col xl:flex-row items-center justify-center relative w-full">
        <motion.p
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl uppercase tracking-[-0.04em] leading-[18px] text-white/40 xl:absolute xl:left-10 mb-4 xl:mb-0 order-1 xl:order-none"
        >
          Look book
        </motion.p>

        <div className="flex flex-col items-center order-2 xl:order-none">
          <div className="overflow-clip z-[5]">
            <motion.h1
              initial={{ y: 250 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="xl:text-[60px] xl:leading-[66px] 
         lg:text-[46px] lg:leading-[54px] 
         md:text-[42px] md:leading-[50px] 
         sm:text-[34px] sm:leading-[42px] 
         text-[30px] leading-[36px] 
         tracking-[-0.04em] uppercase text-center z-[5]"
            >
              Ваш стиль, ваше заявление&nbsp;—
            </motion.h1>
          </div>
          <div className="overflow-clip z-[5]">
            <motion.h1
              initial={{ y: 250 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="xl:text-[60px] xl:leading-[66px] 
         lg:text-[46px] lg:leading-[54px] 
         md:text-[42px] md:leading-[50px] 
         sm:text-[34px] sm:leading-[42px] 
         text-[30px] leading-[36px] 
         tracking-[-0.04em] uppercase text-center z-[5]"
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
              className="xl:text-[60px] xl:leading-[66px] 
         lg:text-[46px] lg:leading-[54px] 
         md:text-[42px] md:leading-[50px] 
         sm:text-[34px] sm:leading-[42px] 
         text-[30px] leading-[36px] 
         tracking-[-0.04em] uppercase text-center z-[5]"
            >
              и будьте в центре внимания
            </motion.h1>
          </div>
        </div>

        <motion.p
          initial={{ x: 250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl tracking-[-0.04em] leading-[18px] text-white/40 xl:absolute xl:right-10 mt-4 xl:mt-0 order-3 xl:order-none"
        >
          MATTHEW MASLOV
        </motion.p>
      </div>
      <ImageGroup images={imageConfigs} />
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
  )
}

export default Hero
