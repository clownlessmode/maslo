import { createTBankSession } from "@/lib/t-bank"
import { registerCdekOrder } from "@/lib/cdek"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { z } from "zod"

const createSessionSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  quantity: z.number().min(1).max(5),
  promocode: z.string().optional(),
})

export const paymentRouter = router({
  createTBankSession: publicProcedure
    .input(createSessionSchema)
    .mutation(async ({ input, c }) => {
      const session = await createTBankSession({
        Email: input.email,
        Phone: input.phone,
        Quantity: input.quantity,
        promocode: input.promocode,
      })

      return c.json(session)
    }),

  registerCdekOrder: publicProcedure
    .input(z.any())
    .mutation(async ({ input, c }) => {
      const result = await registerCdekOrder(input)

      if (result.success) {
        return c.json({ order: result.order })
      } else {
        return c.json({ error: result.error }, 400)
      }
    }),
})
