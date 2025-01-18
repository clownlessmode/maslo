import { motion } from "framer-motion"

import { MotionValue } from "framer-motion"

interface SequenceContainerProps {
  opacity: MotionValue<number>
  children: React.ReactNode
}

function SequenceContainer({ opacity, children }: SequenceContainerProps) {
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {children}
    </motion.div>
  )
}

export default SequenceContainer
