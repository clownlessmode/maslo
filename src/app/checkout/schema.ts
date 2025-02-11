import { ShipmentMethod } from "@prisma/client"
import { z } from "zod"

const formSchema = z
  .object({
    name: z.string().min(10, "ФИО должно содержать не менее 10 символов"),
    email: z.string().email("Некорректный адрес электронной почты"),
    phone: z
      .string()
      .min(12, "Номер телефона должен содержать не менее 11 цифр")
      .refine(
        (value) => {
          const digitsOnly = value.replace(/\D/g, "")
          return digitsOnly.length === 11 && digitsOnly.startsWith("7")
        },
        { message: "Некорректный номер телефона" }
      ),
    promocode: z.string().optional(),
    city: z.string().min(1, "Город обязателен к заполнению"),
    shipment: z.enum(["pochta", "cdek", "selfpickup"], {
      required_error:
        "Выберите способ доставки (Почта России, СДЭК или самовывоз)",
    }),
    pickup_office: z.string().optional(),
    street: z.string().optional(),
    house: z.string().optional(),
    apartment: z.string().optional(),
    postalCode: z.string().optional(),
    oblast: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.shipment === "cdek" && !data.pickup_office) {
        throw new Error("Выберите пункт выдачи СДЭК")
      }

      if (data.shipment === "pochta") {
        if (!data.street || data.street.length < 1) {
          throw new Error("Укажите улицу для доставки Почтой России")
        }
        if (!data.house || data.house.length < 1) {
          throw new Error("Укажите номер дома для доставки Почтой России")
        }
        if (!data.postalCode || !/^\d{6}$/.test(data.postalCode)) {
          throw new Error(
            "Укажите корректный индекс (6 цифр) для доставки Почтой России"
          )
        }
      }

      return true
    },
    {
      message: "Заполните все обязательные поля доставки",
    }
  )

export default formSchema
