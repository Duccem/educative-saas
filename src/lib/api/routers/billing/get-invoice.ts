import { polar } from "@/lib/payments/client";
import z from "zod";
import { protectedProcedure } from "../..";

export const getInvoice = protectedProcedure
  .route({
    method: "GET",
    path: "/invoice/:orderId",
  })
  .input(
    z.object({
      orderId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const order = await polar.orders.get({ id: input.orderId });

    if (!order.isInvoiceGenerated) {
      return {
        state: "not_generated",
      };
    }

    try {
      const invoice = await polar.orders.invoice({
        id: input.orderId,
      });

      return {
        state: "ready",
        url: invoice.url,
      };
    } catch (error) {
      return {
        state: "generating",
      };
    }
  });
