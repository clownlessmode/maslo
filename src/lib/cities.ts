import { z } from "zod"

// Define the shape of the city data using Zod for validation
const CitySchema = z.object({
  code: z.number(),
  city: z.string(),
})

export interface City extends z.infer<typeof CitySchema> {}

// Function to fetch cities data
export function fetchCities(): Promise<City[]> {
  return fetch("/cities.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch cities data")
      }
      return response.json()
    })
    .then((data) => {
      // Validate the data using Zod
      const result = z.array(CitySchema).safeParse(data)
      if (!result.success) {
        console.error("Invalid cities data", result.error)
        throw new Error("Invalid cities data")
      }
      return result.data
    })
    .catch((error) => {
      console.error("Error fetching cities:", error)
      return []
    })
}
