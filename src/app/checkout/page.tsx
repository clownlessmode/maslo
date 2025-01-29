"use client"

import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { fetchCities, City } from "@/lib/cities"
import { useEffect, useState, useCallback } from "react"

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
import { calculatePrice } from "@/lib/checkout"
import formSchema from "./schema"
import debounce from "lodash/debounce"

const CheckoutPage = () => {
  const router = useRouter()
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

  const { mutate: createTBankSession } = useMutation({
    mutationFn: async () => {
      const res = await client.payment.createTBankSession.$post({
        email: form.getValues("email"),
        phone: form.getValues("phone"),
        quantity: quantity,
      })
      return await res.json()
    },
    onSuccess: (data) => {
      if (data.success && data.url) {
        router.push(data.url)
      } else {
        console.error("Ошибка при создании сессии:", data)
      }
    },
  })

  const [isPending, startTransition] = useTransition()

  const [quantity, setQuantity] = useState(1)
  const [total, setTotal] = useState(13590)

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        // Валидация формы
        const validationResult = formSchema.safeParse(data)

        if (!validationResult.success) {
          console.log("Ошибки валидации:")
          validationResult.error.errors.forEach((error) => {
            console.log(`- ${error.message}`)
          })
          return
        }

        // Create order first with quantity and total from ProductCard
        const order = await createOrder({
          ...data,
          quantity: quantity,
          amount: total * 100, // Convert to kopeks
        })

        // Only create payment session if order creation was successful
        if (order) {
          createTBankSession()
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Ошибка валидации:", error.message)
        } else {
          console.error("Failed to create order:", error)
        }
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
              <ProductCard
                quantity={quantity}
                setQuantity={setQuantity}
                total={total}
                setTotal={setTotal}
              />
            </div>
          </form>
        </Form>
      </Container>
    </div>
  )
}

const ProductCard = ({
  quantity,
  setQuantity,
  total,
  setTotal,
}: {
  quantity: number
  setQuantity: (value: number) => void
  total: number
  setTotal: (value: number) => void
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
    <div className="flex w-full h-full flex-col rounded-[20px] max-h-[1104px] relative overflow-hidden ">
      {/* <div className="flex items-center justify-center bg-[#171717] h-full"> */}

      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        className="w-full h-full object-cover min-w-[300px] min-h-[300px]"
      >
        <source src="/assets/loops.mp4" type="video/mp4" />
        {/* <source src="/assets/loops.webm" type="video/webm" /> */}
      </video>

      <div className="h-50% p-[50px] bg-background-100 rounded-b-[20px] flex flex-col">
        <p className="md:text-[48px] md:leading-[58px] text-[32px] leading-[38px] font-semibold flex flex-col gap-0">
          <span className="md:text-[20px] md:leading-[24px] text-[16px] leading-[20px] font-normal">
            Down Jacket
          </span>
          &quot;WARM AS BUTTER&quot;
        </p>
        <div className="flex items-center justify-between mt-[35px]">
          <p className="md:text-[20px] md:leading-[24px] text-[16px] leading-[20px] font-normal">
            SIZE: M {/* size */}
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

// Separate SVG components for cleaner code
const MinusIcon = () => (
  <svg width="12" height="3" viewBox="0 0 12 3" fill="none">
    <line
      x1="11.6719"
      y1="1.40675"
      x2="0.265012"
      y2="1.40675"
      stroke="#0F0F0F"
      strokeWidth="1.7549"
    />
  </svg>
)

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <line
      x1="5.96534"
      y1="0.264648"
      x2="5.96534"
      y2="11.6715"
      stroke="#0F0F0F"
      strokeWidth="1.7549"
    />
    <line
      x1="11.6055"
      y1="6.03077"
      x2="0.198606"
      y2="6.03077"
      stroke="#0F0F0F"
      strokeWidth="1.7549"
    />
  </svg>
)

export default CheckoutPage
