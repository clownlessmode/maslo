import Image from "next/image"
import React from "react"

const Door = () => {
  return (
    <div className="w-full h-fit mt-[40px] rounded-[20px] overflow-hidden">
      <Image
        src={"/door.png"}
        width={2000}
        height={1000}
        alt="door"
        quality={100}
      />
    </div>
  )
}

export default Door
