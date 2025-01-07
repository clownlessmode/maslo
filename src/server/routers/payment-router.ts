import { createTBankSession } from "@/lib/t-bank"
import { registerCdekOrder } from "@/lib/cdek"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { z } from "zod"

export const paymentRouter = router({
  createTBankSession: publicProcedure.mutation(async ({ c, ctx }) => {
    const session = await createTBankSession({
      Email: "test@test.com",
      Phone: "+71234567890",
      Quantity: 1,
    })

    return c.json(session)
  }),

  registerCdekOrder: publicProcedure
    .input(z.any())
    .mutation(async ({ input, c, ctx }) => {
      const result = await registerCdekOrder(input)

      if (result.success) {
        return c.json({ order: result.order })
      } else {
        return c.json({ error: result.error }, 400)
      }
    }),
})
