import footer from "@/data/footer"
import Link from "next/link"
import Image from "next/image"
import logo from "../../../public/logo.png"

import {
  VisualElementFooterText,
  VisualElementFooterTextSm,
} from "../visual/footer-text"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

const Footer = () => {
  const getData = footer()

  return (
    <footer className="px-5 sm:px-10 pt-4 lg:pt-[50px] relative flex flex-col bg-background-100 gap-y-[54px]">
      <svg
        className="absolute right-0 top-0 w-[96px] lg:w-[164px] h-auto"
        width="164"
        height="77"
        viewBox="0 0 164 77"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 46C23 28.8 17.4999 32.5 5.99996 25.5C-5.5 18.5 5.99996 0 5.99996 0H164V21.5C161.833 19.1667 156.8 16.6 154 25C151.2 33.4 146.833 31.1667 145 29C144.667 25.5 142.4 18.5 136 18.5C122 18.5 127.5 38 119.5 44.5C113.1 49.7 110.5 43.6667 110 40C110 36.6667 109 28 102.5 26.5C92 23.5 91.6666 50.6667 92.5 65.5C92.5 69.6667 90.6 77.7 83 76.5C75.4 75.3 74.5 50 75 37.5C75.1666 32 74.2 20.7 69 19.5C63.8 18.3 59.5 28 57.5 34C56.3614 37.4157 52 36 52 32C52 26.1477 47.3333 18.8334 45 18.5C41.6666 17.6667 35.4 20.3 37 37.5C38 58.5 33.6666 61.3334 31 62.5C27.5 63.5 20.6 61.6 21 46Z"
          fill="#FFD972"
        />
      </svg>

      <div className="flex justify-between items-end">
        <div className="flex w-full flex-col lg:flex-row gap-y-[45px] items-start lg:gap-x-[195px]">
          <Link href="/" className="lg:mr-[15px]">
            <Image
              src={logo}
              alt="logo"
              quality={100}
              className="w-[54px] lg:w-[79px] brightness-0 invert"
            />
          </Link>
          <div className="w-full lg:gap-x-[195px] inline-flex lg:justify-start justify-between">
            <div className="flex flex-col gap-y-4 lg:gap-y-6">
              {getData.primarySection.map((i) => (
                <Link
                  className="text-[#DDDDDD] hover:text-white transition-colors duration-200 uppercase text-md lg:text-lg"
                  key={i.title}
                  href={i.link}
                >
                  {i.title}
                </Link>
              ))}
              <div className=" flex-col gap-y-1.5 lg:hidden flex">
                <span className="text-md uppercase">
                  WEBSITE BY{" "}
                  <Link href={getData.madeBy.link}>{getData.madeBy.title}</Link>
                </span>
                <span className="text-[12px] uppercase text-white/20">
                  *запрещена на территории РФ
                </span>
              </div>
            </div>
            <div className="flex flex-col pr-12 gap-y-4 lg:gap-y-6">
              {getData.secondarySection.map((i) => (
                <Link
                  className="text-[#DDDDDD] hover:text-white transition-all duration-200 uppercase text-md lg:text-lg flex items-center group"
                  key={i.title}
                  href={i.link}
                >
                  <ArrowUpRight className="transition-transform duration-200 group-hover:rotate-90" />
                  {i.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-col gap-y-8 items-end justify-between h-full lg:flex hidden">
          <span className="text-lg uppercase text-nowrap">
            WEBSITE BY{" "}
            <Link href={getData.madeBy.link}>{getData.madeBy.title}</Link>
          </span>
          <span className="text-sm text-end uppercase text-white/10 text-nowrap">
            *деятельность организации <br />
            запрещена на территории РФ
          </span>
        </div>
      </div>
      <div className="lg:block hidden">
        <VisualElementFooterText />
      </div>
      <div className="lg:hidden block">
        <VisualElementFooterTextSm />
      </div>
    </footer>
  )
}

Footer.displayName = "Footer"

export default Footer
