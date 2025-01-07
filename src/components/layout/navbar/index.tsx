"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import menu from "@/data/navbar"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/utils"
import { usePathname } from "next/navigation"
import logo from "../../../../public/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const getMenu = menu()
  const pathname = usePathname()

  return (
    <>
      <nav
        className={cn(
          "flex items-center justify-between px-5 sm:px-10 sticky top-0 py-[30px] sm:py-4 z-[9999]",
          pathname === "/details" ? "bg-[#0d0d0d]" : "bg-background-200"
        )}
      >
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            quality={100}
            className="w-[55px] z-[999] sm:w-[79px] brightness-0 invert"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="sm:inline-flex hidden items-center gap-x-[60px]">
          {getMenu.primarySection.map((i) => (
            <Link
              className="text-[#DDDDDD] hover:text-white transition-colors duration-200 uppercase text-lg"
              key={i.title}
              href={i.link}
            >
              {i.title}
            </Link>
          ))}
        </div>
        <div className="sm:inline-flex hidden items-center gap-x-[30px]">
          {getMenu.secondarySection.map((i) => (
            <Link
              className="text-[#DDDDDD] hover:text-white transition-colors duration-200 uppercase text-lg"
              key={i.title}
              href={i.link}
            >
              {i.title}
            </Link>
          ))}
        </div>

        {/* Burger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden flex flex-col gap-1.5 z-[10000]"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-[#DDDDDD] block"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-[#DDDDDD] block"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-[#DDDDDD] block"
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-background-200 w-full h-screen z-[999] sm:hidden"
          >
            <div className="flex flex-col items-start px-5 justify-between h-full pb-[70px]">
              <div />
              <div className="flex flex-col gap-y-[30px]">
                {getMenu.primarySection.map((item) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href={item.link}
                      className="text-[#DDDDDD] uppercase text-[60px] tracking-[-0.04em]"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-flow-row grid-cols-2 gap-x-[25px] gap-y-[30px]">
                {getMenu.secondarySection.map((item) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href={item.link}
                      className="text-[#DDDDDD] uppercase text-2xl"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
