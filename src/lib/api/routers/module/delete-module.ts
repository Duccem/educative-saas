import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { eq } from "drizzle-orm";
import { module as moduleTable } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteModule = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;

    const canDeleteModule = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          module: ["delete"],
        },
      },
    });

    if (!canDeleteModule.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a module",
      });
    }

    const existingModule = await database.query.module.findFirst({
      where: eq(moduleTable.id, id),
      with: {
        course: true,
      },
    });

    if (!existingModule) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Module not found",
      });
    }

    if (existingModule.course.organization_id !== context.organization.id) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Module not found",
      });
    }

    await database.delete(moduleTable).where(eq(moduleTable.id, id));

    return {
      success: true,
    };
  });

