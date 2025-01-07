"use client"

import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { fetchCities, City } from "@/lib/cities"
import { useEffect, useState } from "react"

import { AutoComplete } from "@/components/ui/autocomplete"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { PhoneInput } from "@/components/ui/phone-input"
import { client } from "@/lib/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTransition, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getCdekOffices } from "@/lib/cdek"
import { useQuery } from "@tanstack/react-query"
import { sendTelegramMessage } from "@/lib/telegram"
import { createOrder } from "@/lib/orders"

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
    city: z.string().min(1, "Город обязателен к заполнению"),
    shipment: z.enum(["pochta", "cdek", "selfpickup"], {
      required_error: "Необходимо выбрать вид доставки",
    }),
    pickup_office: z
      .string()
      .min(1, "Обязательно выбрать пункт выдачи")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.shipment !== "selfpickup" && !data.pickup_office) {
        return false
      }
      return true
    },
    {
      message: "Обязательно выбрать пункт выдачи",
      path: ["pickup_office"],
      //   value: z.number().min(0, "Некорректный формат цены"),
      //   quantity: z.number().min(1).max(5),
    }
  )

interface Option {
  label: string
  value: string
}

const CheckoutPage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate: createTBankSession } = useMutation({
    mutationFn: async () => {
      const res = await client.payment.createTBankSession.$post()
      return await res.json()
    },
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url)
      }
    },
  })

  const [isPending, startTransition] = useTransition()

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        // Create order first
        const order = await createOrder(data)

        // Only create payment session if order creation was successful
        if (order) {
          createTBankSession()
        }
      } catch (error) {
        console.error("Failed to create order:", error)
        // You may want to show an error toast here
      }
    })
  }

  const [cities, setCities] = useState<City[]>([])

  useEffect(() => {
    fetchCities()
      .then(setCities)
      .catch(() => console.log("error while fetching cities"))
  }, [])

  const formattedCities = useMemo(
    () =>
      cities?.map((item) => ({
        label: item.city,
        value: item.code.toString(),
      })) ?? [],
    [cities]
  )

  const selectedShipment = form.watch("shipment")
  const selectedCity = form.watch("city")

  const { data: cdekOffices } = useQuery({
    queryKey: ["cdekOffices", selectedCity],
    queryFn: async () => {
      if (!selectedCity) return null
      const cityCode = parseInt(selectedCity)
      const result = await getCdekOffices(cityCode)
      return result.success ? result.offices : []
    },
    enabled: selectedShipment === "cdek" && !!selectedCity,
  })

  const pickupOptions = useMemo(() => {
    if (selectedShipment === "cdek" && cdekOffices) {
      return cdekOffices.map((office) => ({
        label: `${office.location.address} (${office.code})`,
        value: office.code,
      }))
    }
    // Add other delivery method options here
    return []
  }, [selectedShipment, cdekOffices])

  return (
    <div className="pt-[60px] pb-[100px] min-h-screen">
      {selectedShipment}
      {selectedCity}
      {cdekOffices?.map((office) => office.name)}
      <Container>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 space-x-5">
              <div className="flex flex-col gap-y-[60px]">
                <div className="flex flex-col gap-y-[30px]">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-[15px]">
                        <FormLabel className="uppercase pl-[50px]">
                          фио получателя
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="иванов иван иванович"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-[15px]">
                        <FormLabel className="uppercase pl-[50px]">
                          Номер телефона
                        </FormLabel>
                        <FormControl>
                          <PhoneInput {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-[15px]">
                        <FormLabel className="uppercase pl-[50px]">
                          email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@site.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-y-[30px]">
                  <span className="text-[32px] font-semibold pl-[50px] uppercase leading-[38px]">
                    Доставка
                  </span>
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-[15px]">
                        <FormLabel className="uppercase pl-[50px]">
                          город
                        </FormLabel>
                        <FormControl>
                          <AutoComplete
                            options={formattedCities}
                            emptyMessage="Город не найден"
                            placeholder="Выберите город"
                            // Only pass the value string, not the entire option object
                            value={field.value || ""}
                            onValueChange={(value: string) => {
                              field.onChange(value)
                              form.setValue("pickup_office", "")
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipment"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-[15px]">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue="pochta"
                            className="pt-2"
                          >
                            <FormItem className="flex items-center space-x-[25px]">
                              <FormControl>
                                <RadioGroupItem value="pochta" />
                              </FormControl>
                              <FormLabel className="uppercase">
                                почта россии
                              </FormLabel>
                              <span className="text-lg text-white/40 uppercase pl-[5px]">
                                от 14 дней, от 200 р.
                              </span>
                            </FormItem>
                            <FormItem className="flex items-center space-x-[25px]">
                              <FormControl>
                                <RadioGroupItem value="cdek" />
                              </FormControl>
                              <FormLabel className="uppercase">сдэк</FormLabel>
                              <span className="text-lg text-white/40 uppercase pl-[5px]">
                                оот 7 дней, от 500 р.
                              </span>
                            </FormItem>
                            <FormItem className="flex items-center space-x-[25px]">
                              <FormControl>
                                <RadioGroupItem value="selfpickup" />
                              </FormControl>
                              <FormLabel className="uppercase">
                                самовывоз
                              </FormLabel>
                              <span className="text-lg text-white/40 uppercase pl-[5px]">
                                бесплатно
                              </span>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickup_office"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-[15px]">
                        <FormLabel className="uppercase pl-[50px]">
                          пункт получения
                        </FormLabel>
                        <FormControl>
                          {selectedShipment === "selfpickup" ? (
                            <Input
                              disabled
                              placeholder="Самовывоз"
                              {...field}
                            />
                          ) : selectedShipment === "cdek" ? (
                            <AutoComplete
                              options={pickupOptions}
                              emptyMessage="Нет доступных пунктов выдачи"
                              placeholder="Выберите пункт выдачи"
                              value={field.value || ""}
                              onValueChange={(value: string) => {
                                field.onChange(value)
                              }}
                              disabled={!selectedCity}
                            />
                          ) : (
                            <Input
                              placeholder="Выберите пункт получения"
                              {...field}
                            />
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button size="sm" variant="default_v2" type="submit">
                  Оформить заказ
                </Button>
              </div>
              {/* <ProductCard /> */}
            </div>
          </form>
        </Form>
      </Container>
    </div>
  )
}

// const ProductCard = () => {
//   const [quantity, setQuantity] = useState(1)
//   const [total, setTotal] = useState(19000)

//   const handleQuantityChange = async (increment: boolean) => {
//     const newQuantity = increment ? quantity + 1 : quantity - 1

//     if (newQuantity < 1 || newQuantity > 5) return

//     const result = await calculatePrice(newQuantity)

//     if (result.success) {
//       setQuantity(result.quantity)
//       setTotal(result.total)
//     }
//   }

//   return (
//     <div className="flex w-full mt-[44px] flex-col rounded-[20px] max-h-[885px] relative overflow-hidden">
//       {/* ... existing code ... */}
//       <div className="space-x-[45px] flex items-center">
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => handleQuantityChange(false)}
//             disabled={quantity <= 1}
//             className="size-[22px] rounded-full flex items-center justify-center text-black bg-brand disabled:opacity-50"
//           >
//             <MinusIcon />
//           </button>
//           <span className="text-[2rem] leading-[2.4rem]">{quantity}X</span>
//           <button
//             onClick={() => handleQuantityChange(true)}
//             disabled={quantity >= 5}
//             className="size-[22px] rounded-full flex items-center justify-center text-black bg-brand disabled:opacity-50"
//           >
//             <PlusIcon />
//           </button>
//         </div>
//         <span className="text-[2rem] leading-[2.4rem]">
//           {total.toLocaleString()}₽
//         </span>
//       </div>
//       {/* ... rest of the code ... */}
//     </div>
//   )
// }

// // Separate SVG components for cleaner code
// const MinusIcon = () => (
//   <svg width="12" height="3" viewBox="0 0 12 3" fill="none">
//     <line
//       x1="11.6719"
//       y1="1.40675"
//       x2="0.265012"
//       y2="1.40675"
//       stroke="#141414"
//       strokeWidth="1.7549"
//     />
//   </svg>
// )

// const PlusIcon = () => (
//   <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//     <line
//       x1="5.96534"
//       y1="0.264648"
//       x2="5.96534"
//       y2="11.6715"
//       stroke="#141414"
//       strokeWidth="1.7549"
//     />
//     <line
//       x1="11.6055"
//       y1="6.03077"
//       x2="0.198606"
//       y2="6.03077"
//       stroke="#141414"
//       strokeWidth="1.7549"
//     />
//   </svg>
// )

export default CheckoutPage
