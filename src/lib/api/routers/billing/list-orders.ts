import { polar } from "@/lib/payments/client";
import { protectedProcedure } from "../..";
import z from "zod";

export const ordersList = protectedProcedure
  .route({ method: "GET", path: "/orders" })
  .input(
    z.object({
      page: z.string().optional(),
    }),
  )
  .handler(async ({ context: { organization }, input }) => {
    const customer = await polar.customers.getExternal({
      externalId: organization?.id ?? "",
    });
    const response = await polar.orders.list({
      customerId: customer.id,
      page: Number(input.page) || 1,
      limit: 10,
    });
    return {
      items: response.result.items,
      pagination: response.result.pagination,
    };
  });
