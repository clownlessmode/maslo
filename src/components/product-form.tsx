"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface SizeButtonProps {
  size: string
  selectedSize: string | null
  onSelect: (size: string) => void
}

interface Size {
  value: string
  label: string
}

export const SIZES: Size[] = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
]

function SizeButton({ size, selectedSize, onSelect }: SizeButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(size)}
      className={cn(
        "xl:size-[87px] size-[60px] rounded-[15px] border border-white text-[14px] xl:text-2xl transition-colors",
        selectedSize === size && "bg-white text-black"
      )}
    >
      {size}
    </button>
  )
}

function ProductForm() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSize) return

    router.push(`/checkout?size=${selectedSize.toLowerCase()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 xl:flex grid grid-cols-2 rounded-[15px] gap-[14px] bg-[#9C9C9C]/10 backdrop-blur-[20px]"
    >
      <Button className="px-[52px] bg-white order-2" variant="default_v2">
        13.590 ₽
      </Button>

      <div className="flex gap-x-2.5 items-center order-1">
        {["S", "M", "L"].map((size) => (
          <SizeButton
            key={size}
            size={size}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
          />
        ))}
      </div>
      <Button
        type="submit"
        disabled={!selectedSize}
        className={cn(
          "px-[88px] transition-opacity col-span-2",
          !selectedSize && "opacity-50 cursor-not-allowed"
        )}
        variant="default_v2"
      >
        BUY
      </Button>
    </form>
  )
}

export default ProductForm
