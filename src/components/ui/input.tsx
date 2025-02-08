import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[50px] sm:h-[69px] w-full text-lg sm:text-2xl uppercase rounded-[15px] sm:rounded-[20px] bg-background-100 px-[20px] sm:px-[50px] font-normal py-3 sm:py-5 file:border-0 file:bg-transparent transition-colors file:text-xs sm:file:text-sm file:font-medium file:text-zinc-950 placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#767676] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
