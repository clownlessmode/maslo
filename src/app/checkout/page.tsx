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
import formSchema from "./schema"
import RightSide from "./RightSide"
import { off } from "node:process"
export default function Checkout({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [quantity, setQuantity] = useState(1)
  const [total, setTotal] = useState(13590)
  const [cities, setCities] = useState<City[]>([])

  const size = searchParams.size
    ? Array.isArray(searchParams.size)
      ? searchParams.size[0]
      : searchParams.size
    : "M"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipment: "pochta",
      street: "",
      house: "",
      apartment: "",
      postalCode: "",
      pickup_office: "",
    },
  })

  const { mutateAsync: createTBankSession } = useMutation({
    mutationFn: async (data: {
      email: string
      phone: string
      quantity: number
    }) => {
      const res = await client.payment.createTBankSession.$post({
        email: data.email,
        phone: data.phone,
        quantity: data.quantity,
      })
      return (await res.json()) as {
        success: boolean
        orderId?: string
        url?: string
      }
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        console.log("🚀 Начало создания заказа...")

        // Сначала получаем сессию Тинькофф
        const tbankResponse = await createTBankSession({
          email: data.email,
          phone: data.phone,
          quantity: quantity,
        })

        console.log("📦 Ответ от TBank:", tbankResponse)

        if (!tbankResponse.success || !tbankResponse.orderId) {
          throw new Error("Не удалось создать платежную сессию")
        }

        // Создаем заказ с ID от Тинькофф
        const order = await createOrder({
          ...data,
          quantity,
          amount: total * 100,
          orderId: tbankResponse.orderId, // Используем точно тот же ID
        })

        console.log("✅ Заказ создан:", {
          orderId: order.id,
          tinkoffId: tbankResponse.orderId,
        })

        // Только после успешного создания заказа делаем редирект
        if (order && tbankResponse.url) {
          router.push(tbankResponse.url)
        }
      } catch (error) {
        console.error("❌ Ошибка при создании заказа:", error)
        await sendTelegramMessage({
          message: `
  ⚠️ Ошибка создания заказа

  ❌ Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}
  📧 Email: ${data.email}
  💰 Сумма: ${total} руб.
  ⏱ Время: ${new Date().toLocaleString("ru-RU")}
            `.trim(),
        })
      }
    })
  }

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
    return []
  }, [selectedShipment, cdekOffices])

  // Добавим useEffect для инициализации формы
  useEffect(() => {
    const shipmentMethod = form.getValues("shipment")
    if (!shipmentMethod) {
      form.setValue("shipment", "pochta")
    }
  }, [form])

  return (
    <div className="pt-[60px] pb-[100px] min-h-screen">
      <Container>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 grid-cols-1 [&>*:first-child]:order-last [&>*:first-child]:lg:order-first gap-5">
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
                            onValueChange={(value) => {
                              field.onChange(value)
                              // Очищаем поля адреса при смене способа доставки
                              if (value !== "pochta") {
                                form.setValue("street", "")
                                form.setValue("house", "")
                                form.setValue("apartment", "")
                                form.setValue("postalCode", "")
                              }
                              if (value !== "cdek") {
                                form.setValue("pickup_office", "")
                              }
                            }}
                            value={field.value}
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
                                от 7 дней, от 500 р.
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
                          {selectedShipment === "pochta"
                            ? "адрес доставки"
                            : "пункт получения"}
                        </FormLabel>
                        <FormControl>
                          {selectedShipment === "selfpickup" ? (
                            <Input
                              disabled
                              placeholder="Самовывоз"
                              value={"Улица Пушкина, д.Колотушкина 13, кв.37"}
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
                            <div className="flex flex-col gap-4">
                              <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Улица"
                                        {...field}
                                        disabled={!selectedCity}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <div className="flex gap-4">
                                <FormField
                                  control={form.control}
                                  name="house"
                                  render={({ field }) => (
                                    <FormItem className="w-1/3">
                                      <FormControl>
                                        <Input
                                          placeholder="Дом"
                                          disabled={!selectedCity}
                                          {...field}
                                          type="number"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="apartment"
                                  render={({ field }) => (
                                    <FormItem className="w-1/3">
                                      <FormControl>
                                        <Input
                                          placeholder="Квартира"
                                          disabled={!selectedCity}
                                          type="number"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="postalCode"
                                  render={({ field }) => (
                                    <FormItem className="w-1/3">
                                      <FormControl>
                                        <Input
                                          disabled={!selectedCity}
                                          placeholder="Индекс"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
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
              <RightSide
                quantity={quantity}
                setQuantity={setQuantity}
                total={total}
                setTotal={setTotal}
                size={size}
              />
            </div>
          </form>
        </Form>
      </Container>
    </div>
  )
}
