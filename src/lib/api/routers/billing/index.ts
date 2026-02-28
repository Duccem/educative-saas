import { protectedProcedure } from "../..";
import { initSubscription } from "./init-subscription";
import { statusSubscription } from "./get-subscription";
import { ordersList } from "./list-orders";
import { getInvoice } from "./get-invoice";
import { generateInvoice } from "./generate-invoice";
import { usage } from "./usage";

export const billingRouter = protectedProcedure.prefix("/billing").router({
  initSubscription,
  statusSubscription,
  ordersList,
  getInvoice,
  generateInvoice,
  usage,
});

