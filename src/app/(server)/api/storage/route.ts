import { createRouteHandler } from "uploadthing/next";
import { fileRouter } from "@/lib/storage/core";
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: fileRouter,
});

