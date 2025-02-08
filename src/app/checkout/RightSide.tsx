import { calculatePrice } from "@/lib/checkout"

import { debounce } from "lodash"

import { useCallback } from "react"
import PlusIcon from "./PlusIcon"
import MinusIcon from "./MinusIcon"

const RightSide = ({
  quantity,
  setQuantity,
  total,
  setTotal,
  size,
}: {
  quantity: number
  setQuantity: (value: number) => void
  total: number
  setTotal: (value: number) => void
  size: string
}) => {
  // Создаем мемоизированную debounced функцию
  const debouncedCalculatePrice = useCallback(
    debounce(async (newQuantity: number) => {
      const result = await calculatePrice(newQuantity)
      if (result.success) {
        setQuantity(result.quantity as unknown as number)
        setTotal(result.total as unknown as number)
      }
    }, 300), // 300ms задержка
    [setQuantity, setTotal]
  )

  const handleQuantityChange = (e: React.MouseEvent, increment: boolean) => {
    e.preventDefault()

    const newQuantity = increment ? quantity + 1 : quantity - 1
    if (newQuantity < 1 || newQuantity > 5) return

    // Сразу обновляем UI для лучшего UX
    setQuantity(newQuantity)
    // Делаем запрос с задержкой
    debouncedCalculatePrice(newQuantity)
  }

  return (
    <div className="flex w-full h-full max-h-[88vh] flex-col rounded-[20px]  relative overflow-hidden ">
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        className="w-full h-full object-cover min-w-[300px] min-h-[300px]"
      >
        <source src="/assets/loops.mp4" type="video/mp4" />
      </video>

      <div className="h-50% md:p-[50px] sm:p-[20px] p-[15px] bg-background-100 rounded-b-[20px] flex flex-col">
        <p className="md:text-[48px] md:leading-[58px] text-[32px] leading-[38px] font-semibold flex flex-col gap-0">
          <span className="md:text-[20px] md:leading-[24px] text-[16px] leading-[20px] font-normal">
            Down Jacket
          </span>
          &quot;WARM AS BUTTER&quot;
        </p>
        <div className="flex items-center justify-between mt-[35px]">
          <p className="md:text-[20px] md:leading-[24px] text-[16px] leading-[20px] font-normal">
            SIZE: {size.toString().toUpperCase()}
          </p>
          <div className="md:space-x-[45px] space-x-[20px] flex items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => handleQuantityChange(e, false)}
                disabled={quantity <= 1}
                className="size-[22px] rounded-full flex items-center justify-center text-black bg-brand disabled:opacity-50"
                type="button"
              >
                <MinusIcon />
              </button>
              <span className="md:text-[2rem] md:leading-[2.4rem] text-[1.2rem] leading-[1.4rem]">
                {quantity}X
              </span>
              <button
                onClick={(e) => handleQuantityChange(e, true)}
                disabled={quantity >= 5}
                className="size-[22px] rounded-full flex items-center justify-center text-black bg-brand disabled:opacity-50"
                type="button"
              >
                <PlusIcon />
              </button>
            </div>
            <span className="md:text-[2rem] md:leading-[2.4rem] text-[1.2rem] leading-[1.4rem]">
              {total.toLocaleString()}₽
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RightSide
