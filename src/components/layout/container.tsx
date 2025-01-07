import { cn } from "@/utils"
import { Ref, forwardRef } from "react"

interface Props {
  children: React.ReactNode
  className?: string
}

const Container = forwardRef<HTMLDivElement, Props>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mx-auto w-full relative px-5 sm:px-10", className)}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = "Container"

export default Container
