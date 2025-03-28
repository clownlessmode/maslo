"use client"
// import ThreeDModel from "./_mainpage/3DModel"
// import WarmAs from "./_mainpage/WarmAs"
// import CheckDetails from "./_mainpage/CheckDetails"
// import Price from "./_mainpage/Price"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { sendTelegramMessage } from "@/lib/telegram"
import { useRouter } from "next/navigation"
import InGame from "./InGame"
import Link from "next/link"

function ThanksPage() {
  const [fixedHeight, setFixedHeight] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      telegram: "",
      email: "",
    },
  })

  const onSubmit = async (data: {
    name: string
    telegram: string
    email: string
  }) => {
    setIsSubmitting(true)
    try {
      // Здесь ваша логика отправки данных на сервер
      console.log("Form data:", data)
      sendTelegramMessage({
        message: `
      Новый предзаказ
      Имя  ${data.name}
      Почта  ${data.email}
      Телеграм  ${data.telegram}
              `,
      })
      // Имитация отправкиxs
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 1000)
      router.replace("thanks")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight // Получаем высоту окна
      setFixedHeight(height - 50) // Устанавливаем фиксированное значение
    }

    handleResize() // Устанавливаем высоту при первом рендере
    window.addEventListener("resize", handleResize) // Добавляем обработчик события изменения размера

    return () => {
      window.removeEventListener("resize", handleResize) // Убираем обработчик при размонтировании
    }
  }, [])

  return (
    <div
      className={cn(
        "flex lg:flex-col flex-col w-full px-5 sm:px-10 lg:pb-[calc(66px+80px)] lg:py-[66px] pb-[calc(66px)]   lg:h-full",
        "lg:max-h-[95dvh]",
        `h-[${fixedHeight}px]`
      )}
    >
      <InGame />
      <div className="flex flex-col lg:justify-between lg:flex-row  mt-[18px] lg:mt-[5%] w-full">
        <p className="leading-[1.2] px-[20px] lg:max-w-[45%] lg:text-left full text-center text-[16px] md:text-[20px] xl:text-[24px] 2xl:text-[32px] uppercase font-semibold text-white">
          Теперь именно у тебя есть доступ к дропу раньше всех. Не упусти
          возможность забрать вещи на лучших условиях
        </p>
        <div className="flex flex-col lg:max-w-[40%] mt-[45px] lg:mt-0 w-full md:h-full gap-2 md:gap-5 bg-background-100 rounded-[20px] p-[20px]">
          <p className="leading-[1.2] text-center text-[16px] md:text-[20px] xl:text-[24px] 2xl:text-[32px]  uppercase font-semibold text-white">
            Не теряй время — подписывайся на канал, чтобы быть в курсе всех
            деталей.
          </p>
          <Link
            href={"https://t.me/matthewmaslov"}
            target="_blank"
            className="w-full"
          >
            <Button className="rounded-full w-full h-[69px] mt-[24px]">
              Перейти в Telegram
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ThanksPage

// <div
//   className={cn(
//     "flex md:flex-row flex-col-reverse w-full gap-2 md:gap-5 px-5 sm:px-10 md:pb-[calc(66px+80px)] md:py-[66px] pb-[calc(66px)]   md:h-full",
//     "md:max-h-[95dvh]",
//     `h-[${fixedHeight}px]`
//   )}
// >
//   <div className="flex flex-col md:w-1/2 w-full md:h-full gap-2 md:gap-5 ">
//     <div className="flex flex-row md:h-full gap-2 md:gap-5">
//       <WarmAs />
//     </div>
//     <div className="flex flex-row md:h-full gap-2 md:gap-5 max-h-[35%]">
//       <CheckDetails />
//       <Price />
//     </div>
//   </div>
//   <div className="flex flex-col md:w-1/2 w-full h-full overflow-hidden rounded-[30px]">
//     <ThreeDModel />
//   </div>
// </div>
