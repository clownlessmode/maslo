"use server"

import { z } from "zod"
import { generateToken } from "@/helpers/token"

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
  try {
    const response = await fetch(
      `https://api.cdek.ru/v2/oauth/token?grant_type=client_credentials&client_id=${process.env.CDEK_CLIENT_ID}&client_secret=${process.env.CDEK_CLIENT_SECRET}`,
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

export async function calculateDeliveryPrice(cityCode: number) {
  const token = await getCdekToken()
  const url = "https://api.cdek.ru/v2/calculator/tariff"
  const data = {
    tariff_code: 136,
    from_location: {
      address:
        "Центральная улица, 65/1, дачный посёлок Лесной Городок, Одинцовский городской округ, Московская область",
    },
    to_location: {
      code: cityCode,
    },
    packages: [
      {
        weight: 1540,
      },
    ],
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const { total_sum } = await response.json()
  return Number(total_sum)
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
    // Determine the environment
    const isProduction = true
    const url = isProduction
      ? "https://api.cdek.ru/v2/orders"
      : "https://api.edu.cdek.ru/v2/orders"
    // Make the API call
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include authentication headers if required
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    //
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
