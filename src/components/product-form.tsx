"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SizeButtonProps {
  size: string
  selectedSize: string | null
  onSelect: (size: string) => void
  isOpen?: boolean
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

function SizeButton({
  size,
  selectedSize,
  onSelect,
  isOpen,
}: SizeButtonProps & { isOpen?: boolean }) {
  const isSelected = selectedSize === size

  return (
    <button
      type="button"
      onClick={() => onSelect(size)}
      className={cn(
        "xl:size-[87px] w-[70px] sm:w-[90px] h-[60px] rounded-[15px] border border-white text-[14px] xl:text-2xl transition-colors relative",
        isSelected && "bg-white text-black"
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {size}
        {size === (selectedSize || "M") && (
          <ChevronDownIcon
            strokeWidth={1}
            className={cn(
              "w-5 h-5 xl:hidden transition-transform duration-200",
              isSelected ? "text-black" : "text-white",
              isOpen && "rotate-180" // Добавляем поворот при открытии
            )}
          />
        )}
      </div>
    </button>
  )
}

function ProductForm() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSize) return

    router.push(`/checkout?size=${selectedSize.toLowerCase()}`)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setIsOpen(false)
  }

  const displaySize = selectedSize || "M"

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 flex rounded-[15px] gap-[14px] bg-[#9C9C9C]/10 backdrop-blur-[40px] w-full "
    >
      <Button
        className="sm:px-[52px] sm:w-auto w-full px-5 bg-white order-2 xl:h-auto h-[60px]"
        variant="default_v2"
      >
        13.590 ₽
      </Button>

      <div className="flex gap-x-2.5 items-center xl:order-1">
        {/* Desktop версия остается прежней */}
        <div className="hidden xl:flex gap-x-2.5">
          {SIZES.map((size) => (
            <SizeButton
              key={size.value}
              size={size.label}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          ))}
        </div>

        {/* Мобильная версия */}
        <div className="xl:hidden relative">
          <div className="relative" onClick={() => setIsOpen(!isOpen)}>
            <SizeButton
              size={displaySize}
              selectedSize={selectedSize}
              onSelect={handleSizeSelect}
              isOpen={isOpen} // Передаем состояние открытия
            />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -15 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute  bottom-[70px] left-[-11px] w-fit z-[9999999999] bg-[#1C1C1C] rounded-[15px] py-3 px-3 gap-3 flex flex-col"
              >
                {SIZES.filter((size) => size.label !== displaySize).map(
                  (size) => (
                    <SizeButton
                      key={size.value}
                      size={size.label}
                      selectedSize={selectedSize}
                      onSelect={handleSizeSelect}
                    />
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!selectedSize}
        className={cn(
          "transition-opacity col-span-2 xl:h-auto h-[60px] px-14 w-full",
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
