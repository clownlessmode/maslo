import Container from "@/components/layout/container"
import { VisualElementHeading } from "@/components/visual/details"
import { VisualElementHeadingSm } from "@/components/visual/details"
import { motion, MotionValue } from "framer-motion"
import React from "react"

const WarmAsFirst = ({
  initialContentOpacity,
}: {
  initialContentOpacity: MotionValue<number>
}) => {
  return (
    <Container className="absolute top-[60vh] left-0 w-full flex flex-col items-center">
      <div className="xl:block hidden">
        <VisualElementHeading />
      </div>
      <div className="xl:hidden flex flex-col gap-5">
        <VisualElementHeadingSm />
        <div className="flex justify-between w-full">
          <motion.span
            style={{ opacity: initialContentOpacity }}
            className="text-white/40 text-[14px] xl:text-2xl text-nowrap"
          >
            MATTHEW MASLOV
          </motion.span>
          <motion.span
            style={{ opacity: initialContentOpacity }}
            className="text-white/40 text-[14px] xl:text-2xl text-nowrap"
          >
            DOWN JACKET
          </motion.span>
        </div>
      </div>
    </Container>
  )
}

export default WarmAsFirst
