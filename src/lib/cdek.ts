"use server"

import { z } from "zod"
import { generateToken } from "@/helpers/token"

// Define the schema for the CDEK order registration request
const cdekOrderSchema = z.object({
  type: z.number().optional(),
  additional_order_types: z.array(z.number()).optional(),
  number: z.string().max(40).optional(),
  tariff_code: z.number(),
  comment: z.string().max(255).optional(),
  developer_key: z.string().optional(),
  shipment_point1: z.string().max(255).optional(),
  delivery_point1: z.string().max(255).optional(),
  date_invoice: z.string().optional(), // YYYY-MM-DD
  shipper_name: z.string().max(255).optional(),
  shipper_address: z.string().max(255).optional(),
  delivery_recipient_cost: z
    .object({
      value: z.number(),
      vat_sum: z.number().optional(),
      vat_rate: z.number().optional(),
    })
    .optional(),
  delivery_recipient_cost_adv: z
    .array(
      z.object({
        threshold: z.number(),
        sum: z.number(),
        vat_sum: z.number().optional(),
        vat_rate: z.number().optional(),
      })
    )
    .optional(),
  sender: z
    .object({
      company: z.string().max(255).optional(),
      name: z.string().max(255).optional(),
      email: z.string().email().optional(),
      passport_series: z.string().max(4).optional(),
      passport_number: z.string().max(30).optional(),
      passport_date_of_issue: z.string().optional(), // YYYY-MM-DD
      passport_organization: z.string().max(255).optional(),
      tin: z.string().length(10).or(z.string().length(12)).optional(),
      passport_date_of_birth: z.string().optional(), // YYYY-MM-DD
      phones: z
        .array(
          z.object({
            number2: z.string().regex(/^\+7\d{10,}$/),
            additional: z.string().max(255).optional(),
          })
        )
        .optional(),
      contragent_type: z.enum(["LEGAL_ENTITY", "INDIVIDUAL"]).optional(),
    })
    .optional(),
  seller: z
    .object({
      name: z.string().max(255).optional(),
      inn: z.string().length(10).or(z.string().length(12)).optional(),
      phone: z.string().max(255).optional(),
      ownership_form: z.number().optional(),
      address: z.string().max(255).optional(),
    })
    .optional(),
  recipient: z.object({
    company: z.string().max(255).optional(),
    name: z.string().max(255),
    passport_series: z.string().max(4).optional(),
    passport_number: z.string().max(30).optional(),
    passport_date_of_issue: z.string().optional(), // YYYY-MM-DD
    passport_organization: z.string().max(255).optional(),
    tin: z.string().length(10).or(z.string().length(12)).optional(),
    passport_date_of_birth: z.string().optional(), // YYYY-MM-DD
    email: z.string().email().optional(),
    phones: z.array(
      z.object({
        number2: z.string().regex(/^\+7\d{10,}$/),
        additional: z.string().max(255).optional(),
      })
    ),
    contragent_type: z.enum(["LEGAL_ENTITY", "INDIVIDUAL"]).optional(),
  }),
  from_location1: z
    .object({
      location: z.string().optional(),
      code: z.number().optional(),
      fias_guid: z.string().uuid().optional(),
      postal_code: z.string().max(255).optional(),
      longitude: z.number().optional(),
      latitude: z.number().optional(),
      country_code: z.string().length(2).optional(),
      region: z.string().max(255).optional(),
      region_code: z.number().optional(),
      sub_region: z.string().max(255).optional(),
      city: z.string().max(255).optional(),
      kladr_code: z.string().max(255).optional(),
      address: z.string().max(255).optional(),
    })
    .optional(),
  to_location1: z
    .object({
      location: z.string().optional(),
      code: z.number().optional(),
      fias_guid: z.string().uuid().optional(),
      postal_code: z.string().max(255).optional(),
      longitude: z.number().optional(),
      latitude: z.number().optional(),
      country_code: z.string().length(2).optional(),
      region: z.string().max(255).optional(),
      region_code: z.number().optional(),
      sub_region: z.string().max(255).optional(),
      city: z.string().max(255).optional(),
      kladr_code: z.string().max(255).optional(),
      address: z.string().max(255).optional(),
    })
    .optional(),
  services: z
    .array(
      z.object({
        code: z.string().max(16),
        parameter: z.string().optional(),
      })
    )
    .optional(),
  packages: z.array(
    z.object({
      number: z.string().max(30),
      weight: z.number(),
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      comment: z.string().max(255).optional(),
      items4: z.array(
        z.object({
          name: z.string().max(255),
          ware_key: z.string().max(50),
          marking3: z.string().optional(),
          payment: z
            .object({
              value: z.number(),
              vat_sum: z.number().optional(),
              vat_rate: z.number().optional(),
            })
            .optional(),
          cost: z.number(),
          weight: z.number(),
          weight_gross: z.number().optional(),
          amount: z.number(),
          name_i18n: z.string().max(255).optional(),
          brand: z.string().max(255).optional(),
          country_code: z.string().length(2).optional(),
          material: z.number().optional(),
          wifi_gsm: z.boolean().optional(),
          url: z.string().max(255).optional(),
          feacn_code: z.string().max(255).optional(),
        })
      ),
    })
  ),
  print: z.string().max(7).optional(),
  is_client_return: z.boolean().optional(),
  accompanying_number: z.string().max(255).optional(),
  widget_token: z.string().optional(),
})

interface CdekResponse {
  // Define according to CDEK's API response
  order_id: string
  // Add other relevant fields
}

interface CdekDeliveryPoint {
  code: string
  name: string
  address: string
  location: {
    address: string
  }
  work_time: string
  phones: Array<{ number: string }>
  email?: string
  type: string
  owner_code: string
  take_only: boolean
  is_handout: boolean
  is_reception: boolean
  is_dressing_room: boolean
  have_cashless: boolean
  have_cash: boolean
  coordinates: {
    latitude: number
    longitude: number
  }
  weight_min?: number
  weight_max?: number
}

export async function getCdekToken(): Promise<string> {
  const url = "https://api.edu.cdek.ru/v2/oauth/token"
  const params = new URLSearchParams()
  params.set("grant_type", "client_credentials")
  params.set(
    "client_id",
    process.env.CDEK_CLIENT_ID || "wqGwiQx0gg8mLtiEKsUinjVSICCjtTEP"
  )
  params.set(
    "client_secret",
    process.env.CDEK_CLIENT_SECRET || "RmAmgvSgSl1yirlz9QupbzOJVqhCxcP5"
  )

  try {
    const response = await fetch(
      `https://api.edu.cdek.ru/v2/oauth/token?grant_type=client_credentials&client_id=wqGwiQx0gg8mLtiEKsUinjVSICCjtTEP&client_secret=RmAmgvSgSl1yirlz9QupbzOJVqhCxcP5`,
      {
        method: "POST",
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get CDEK token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("CDEK token error:", {
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    })
    throw error
  }
}

export async function getCdekOffices(
  cityCode: number
): Promise<
  | { success: true; offices: CdekDeliveryPoint[] }
  | { success: false; error: string }
> {
  try {
    const token = await getCdekToken()
    const url = new URL("https://api.edu.cdek.ru/v2/deliverypoints")

    // Add query parameters
    url.searchParams.set("city_code", cityCode.toString())
    url.searchParams.set("size", "1000")

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("CDEK offices fetch error:", {
        status: response.status,
        error: errorData,
        cityCode,
        timestamp: new Date().toISOString(),
      })
      return { success: false, error: "Failed to fetch CDEK offices" }
    }

    const offices = (await response.json()) as CdekDeliveryPoint[]
    return { success: true, offices }
  } catch (error) {
    console.error("CDEK offices fetch error:", {
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      cityCode,
    })

    return {
      success: false,
      error: "Unable to fetch CDEK offices",
    }
  }
}

export async function registerCdekOrder(
  data: unknown
): Promise<
  { success: true; order: CdekResponse } | { success: false; error: string }
> {
  const token = await getCdekToken()
  try {
    // Validate input data
    const validatedData = cdekOrderSchema.parse(data)

    // Determine the environment
    const isProduction = false
    const url = isProduction
      ? "https://api.cdek.ru/v2/orders"
      : "https://api.edu.cdek.ru/v2/orders"
    console.log("validatedData", validatedData)
    // Make the API call
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include authentication headers if required
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("CDEK API error:", {
        status: response.status,
        error: errorData,
        timestamp: new Date().toISOString(),
      })
      return { success: false, error: "Failed to register order with CDEK" }
    }

    const responseData = (await response.json()) as CdekResponse

    return { success: true, order: responseData }
  } catch (error) {
    // Log error securely
    console.error("CDEK order registration error:", {
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    })

    return {
      success: false,
      error: "Unable to process CDEK order registration",
    }
  }
}
