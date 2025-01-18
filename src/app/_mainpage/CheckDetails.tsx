import { Button } from "@/components/ui/button"
import React from "react"
import Link from "next/link"

const CheckDetails = () => {
  return (
    <button
      className="rounded-[20px] md:rounded-[60px] bg-brand hover:text-md xl:hover:text-3xl
              text-md md:text-lg xl:text-2xl flex items-center justify-center w-1/2
              font-semibold p-4 md:h-full h-[73px] text-black "
    >
      <Link href="/details">CHECK DETAILS</Link>
    </button>
  )
}

export default CheckDetails
