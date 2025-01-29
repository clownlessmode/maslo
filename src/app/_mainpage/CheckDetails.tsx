import { Button } from "@/components/ui/button"
import React from "react"
import Link from "next/link"

const CheckDetails = () => {
  return (
    <Link
      href="/details"
      className="rounded-[20px] md:rounded-[60px] bg-brand hover:text-md xl:hover:text-3xl
              text-md md:text-lg xl:text-2xl flex items-center justify-center w-1/2
              font-semibold p-4 md:h-full h-[73px] text-black transition-all"
    >
      <p>CHECK DETAILS</p>
    </Link>
  )
}

export default CheckDetails
