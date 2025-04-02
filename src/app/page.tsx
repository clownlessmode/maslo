"use client"
// import ThreeDModel from "./_mainpage/3DModel"
// import WarmAs from "./_mainpage/WarmAs"
// import CheckDetails from "./_mainpage/CheckDetails"
// import Price from "./_mainpage/Price"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Door from "./_mainpage/Door"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { sendTelegramMessage } from "@/lib/telegram"
import { useRouter } from "next/navigation"
import axios from 'axios'

function HomePage() {
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

      const url = "https://script.google.com/macros/s/AKfycbyu-O8Q006pFj3phHl6FBWTb6I3fppu0liIh3wuObMV5xLBeyjQXj0SnllWaPYkfnU/exec" //url скрипта для отправких данных в Google sheet(Желательно перенести в .env или другой файл, что б не валялось тут)

      //Отправка данных
      axios.post(
        url,
        data,
        {
          headers: {"Content-Type": "application/x-www-form-urlencoded"}
        } 
      )

      console.log("Form data:", data)
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
        "flex lg:flex-row flex-col w-full gap-[20px] md:gap-5 px-5 sm:px-10 lg:pb-[calc(66px+80px)] lg:py-[66px] pb-[calc(66px)]   lg:h-full",
        "lg:max-h-[95dvh]",
        `h-[${fixedHeight}px]`
      )}
    >
      <div className="flex flex-col w-full md:h-full gap-2 md:gap-5 bg-background-100 rounded-[20px] pt-[20px] justify-between">
        <div className="flex flex-col items-center w-full">
          <h1 className="leading-none px-[20px] font-bold uppercase tracking-[-2px]  text-[40px] md:text-[60px] xl:text-[80px] 2xl:text-[90px] text-brand w-full text-center flex justify-center items-center flex-col">
            Мы уходим,
            <br />
            <span className="text-[#434343] text-nowrap">Но не для всех.</span>
          </h1>
          <p className="leading-[1.2] max-w-[450px] lg:max-w-[600px] xl:max-w-full px-[20px] text-center text-[16px] md:text-[20px] xl:text-[24px] 2xl:text-[32px]  mt-[12px] uppercase font-semibold text-white">
            Двери откроются снова — и те, кто внутри, получат ранний доступ и
            специальные условия на следующий дроп.
          </p>
        </div>
        <Door />
      </div>
      <div className="flex flex-col justify-between w-full h-full overflow-hidden  bg-background-100 rounded-[20px] p-[20px]">
        <p className="leading-[1.2] text-center text-[16px] md:text-[20px] xl:text-[24px] 2xl:text-[32px] mt-[12px] uppercase font-semibold text-white">
          Вводи свои данные
          <br />и стань частью MATTHEW MASLOV
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-[24px] flex flex-col gap-[20px] 2xl:gap-[30px]"
        >
          <div className="flex flex-col gap-[10px] text-medium text-[14px] md:text-[16px] xl:text-[20px] 2xl:text-[30px] uppercase">
            <label htmlFor="name" className="pl-[20px]">
              Имя
            </label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              className={`bg-[#343434] h-[57px] xl:h-[59px] 2xl:h-[69px] ${
                errors.name ? "border-red-500" : ""
              }`}
              {...register("name", {
                required: "Имя обязательно для заполнения",
                minLength: {
                  value: 2,
                  message: "Имя должно содержать минимум 2 символа",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs pl-[20px]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-[10px] text-medium text-[14px] md:text-[16px] xl:text-[20px] 2xl:text-[30px] uppercase">
            <label htmlFor="telegram" className="pl-[20px]">
              Телеграм
            </label>
            <Input
              id="telegram"
              placeholder="@telegram_username"
              className={`bg-[#343434] h-[57px] xl:h-[59px] 2xl:h-[69px] ${
                errors.telegram ? "border-red-500" : ""
              }`}
              {...register("telegram", {
                required: "Имя пользователя Telegram обязательно",
                pattern: {
                  value: /^@[a-zA-Z0-9_]{5,32}$/,
                  message:
                    "Введите корректное имя пользователя Telegram (начинается с @)",
                },
              })}
            />
            {errors.telegram && (
              <p className="text-red-500 text-xs pl-[20px]">
                {errors.telegram.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-[10px] text-medium text-[14px] md:text-[16px] xl:text-[20px] 2xl:text-[30px] uppercase">
            <label htmlFor="email" className="pl-[20px]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              className={`bg-[#343434] h-[57px] xl:h-[59px] 2xl:h-[69px] ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "Email обязателен",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный email адрес",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs pl-[20px]">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-[57px] xl:h-[59px] 2xl:h-[69px] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Отправка..."
              : isSuccess
              ? "Успешно отправлено!"
              : "Войти в список"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default HomePage

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
