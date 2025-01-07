import Container from "@/components/layout/container"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

const ImageParallax = () => {
  const [scrollY, setScrollY] = useState(0)

  const handleScroll = () => {
    setScrollY(window.scrollY)
  }

  // Прокрутка
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Функция для расчета движения с учетом z-index
  const calculateTransform = (zIndex: number) => {
    // Чем больше z-index, тем быстрее движение
    const speed = zIndex * 0.3 + 0.1
    return scrollY * speed
  }

  return (
    <Container className="pt-20 relative w-full h-[110vh]">
      <div className="relative">
        <motion.div
          className="flex flex-col gap-5 items-start justify-start absolute left-0 top-0 z-[2]"
          id="1"
          animate={{
            y: -calculateTransform(2),
          }}
          transition={{ type: "tween", duration: 0 }}
        >
          <Image
            alt="image"
            src={"/lookbook/parallax/1.jpg"}
            className="rounded-[20px] w-[600px] h-[765px] object-cover"
            width={600}
            height={765}
            quality={100}
          />
          <h1 className="text-[60px] tracking-[-0.04em] uppercase leading-[66px] text-center">
            Зачем быть обычным?
          </h1>
        </motion.div>

        <motion.div
          id="2"
          className="rounded-[20px] w-[290px] h-[369px] object-cover  absolute left-[620px] z-[3]"
          //   top-[650px]
          animate={{
            y: 650 - calculateTransform(3),
          }}
          transition={{ type: "tween", duration: 0 }}
        >
          <Image
            alt="image"
            src={"/lookbook/parallax/2.jpg"}
            className="rounded-[20px] w-full h-full object-cover"
            width={290}
            height={369}
            quality={100}
          />
        </motion.div>

        <motion.div
          id="3"
          className="rounded-[20px] w-[426px] h-[543px] object-cover  absolute left-[930px] z-[1]"
          //   top-[0px]
          animate={{
            y: -calculateTransform(1),
          }}
          transition={{ type: "tween", duration: 0 }}
        >
          <Image
            alt="image"
            src={"/lookbook/parallax/3.jpg"}
            className="rounded-[20px] w-full h-full object-cover"
            width={426}
            height={543}
            quality={100}
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-5 items-start justify-start absolute right-[0px]  z-[4]"
          //   top-[240px]
          id="4"
          animate={{
            y: -calculateTransform(0),
          }}
          transition={{ type: "tween", duration: 0 }}
        >
          <Image
            alt="image"
            src={"/lookbook/parallax/4.jpg"}
            className="rounded-[20px] w-[600px] h-[765px] object-cover"
            width={600}
            height={765}
            quality={100}
          />
          <h1 className="text-[60px] tracking-[-0.04em] uppercase leading-[66px] text-left">
            Когда можно быть <br />
            <span className="text-brand">
              сливочно
              <br />
              необычным?
            </span>
          </h1>
        </motion.div>

        <motion.div
          id="5"
          className="rounded-[20px] w-[600px] h-[765px] object-cover  absolute left-[0] z-[1]"
          //   top-[1322px]
          animate={{
            y: 1322 - calculateTransform(3),
          }}
          transition={{ type: "tween", duration: 0 }}
        >
          <Image
            alt="image"
            src={"/lookbook/parallax/5.jpg"}
            className="rounded-[20px] w-full h-full object-cover"
            width={600}
            height={765}
            quality={100}
          />
        </motion.div>

        <motion.div
          id="6"
          className="rounded-[20px] w-[290px] h-[369px] object-cover  absolute left-[950px] z-[3]"
          //   top-[1024px]
          animate={{
            y: 1024 - calculateTransform(1),
          }}
          transition={{ type: "tween", duration: 0 }}
        >
          <Image
            alt="image"
            src={"/lookbook/parallax/6.jpg"}
            className="rounded-[20px] w-full h-full object-cover"
            width={290}
            height={369}
            quality={100}
          />
        </motion.div>

        <motion.div
          id="7"
          className="rounded-[20px] w-[452px] h-[577px] object-cover  absolute right-[0px] z-[2]"
          //   top-[1150px]
          animate={{
            y: 1400 - calculateTransform(1),
          }}
          transition={{ type: "tween", duration: 0 }}
        >
          <Image
            alt="image"
            src={"/lookbook/parallax/7.jpg"}
            className="rounded-[20px] w-full h-full object-cover"
            width={452}
            height={577}
            quality={100}
          />
        </motion.div>
      </div>
    </Container>
  )
}

export default ImageParallax
