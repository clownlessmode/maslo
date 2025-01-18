import { motion } from "framer-motion"
const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-[#0d0d0d] z-[99999] flex items-center justify-center"
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: {
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
    >
      <div className="text-center">
        <div className="inline-block relative w-20 h-20 mb-4">
          <div className="absolute border-4 border-white/20 rounded-full w-full h-full" />
          <div
            className="absolute border-4 border-brand rounded-full w-full h-full animate-spin"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${progress}%)`,
            }}
          />
        </div>
        <motion.p
          className="text-white text-xl"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3 },
          }}
        >
          {Math.round(progress)}%
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
