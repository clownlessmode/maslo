"use client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Door from "./_mainpage/Door"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import axios from "axios"

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
      const url =
        "https://script.google.com/macros/s/AKfycbyu-O8Q006pFj3phHl6FBWTb6I3fppu0liIh3wuObMV5xLBeyjQXj0SnllWaPYkfnU/exec"

      axios.post(url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })

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
      const height = window.innerHeight
      setFixedHeight(height - 50)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div
      className="flex lg:flex-row flex-col w-full gap-[20px] md:gap-5 px-5 sm:px-10 lg:pb-[calc(66px+80px)] lg:py-[66px] pb-[calc(66px)]"
      style={{
        minHeight: `${fixedHeight}px`,
        height: "auto", // Убираем фиксированную высоту
      }}
    >
      <div className="flex flex-col w-full gap-2 md:gap-5 bg-background-100 rounded-[20px] pt-[20px] justify-between min-h-[560px]">
        <div className="flex flex-col items-center w-full">
          <h1 className="leading-none px-[20px] font-bold uppercase tracking-[-2px] text-[40px] md:text-[60px] xl:text-[80px] 2xl:text-[90px] text-brand w-full text-center flex justify-center items-center flex-col">
            Мы уходим,
            <br />
            <span className="text-[#434343] text-nowrap">Но не для всех.</span>
          </h1>
          <p className="leading-[1.2] max-w-[450px] lg:max-w-[600px] xl:max-w-full px-[20px] text-center text-[16px] md:text-[20px] xl:text-[24px] 2xl:text-[32px] mt-[12px] uppercase font-semibold text-white">
            Двери откроются снова — и те, кто внутри, получат ранний доступ и
            специальные условия на следующий дроп.
          </p>
        </div>
        <Door />
      </div>

      <div className="flex flex-col justify-between w-full bg-background-100 rounded-[20px] p-[20px] min-h-[560px]">
        <div className="flex-shrink-0">
          <p className="leading-[1.2] text-center text-[16px] md:text-[20px] xl:text-[24px] 2xl:text-[32px] mt-[12px] uppercase font-semibold text-white">
            Вводи свои данные
            <br />и стань частью MATTHEW MASLOV
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[20px] 2xl:gap-[30px] w-full"
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
              className="h-[57px] xl:h-[59px] 2xl:h-[69px] font-semibold flex-shrink-0"
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
    </div>
  )
}

export default HomePage
