"use client"

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { HTTPException } from "hono/http-exception"
import { PropsWithChildren, useState } from "react"

import { useEffect } from "react"
import Lenis from "lenis"

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            let errorMessage: string
            if (err instanceof HTTPException) {
              errorMessage = err.message
            } else if (err instanceof Error) {
              errorMessage = err.message
            } else {
              errorMessage = "An unknown error occurred."
            }
            // toast notify user, log as an example
            console.log(errorMessage)
          },
        }),
      })
  )

  const LenisWrapper = ({ children }: PropsWithChildren) => {
    useEffect(() => {
      // Initialize Lenis
      const lenis = new Lenis()

      // Use requestAnimationFrame to continuously update the scroll
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }, [])

    return <>{children}</>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LenisWrapper>{children}</LenisWrapper>
    </QueryClientProvider>
  )
}
