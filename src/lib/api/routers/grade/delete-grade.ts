import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteGrade = protectedProcedure
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

    const canDeleteGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          grade: ["delete"],
        },
      },
    });

    if (!canDeleteGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a grade",
      });
    }

    const existingGrade = await database.query.grade.findFirst({
      where: and(
        eq(grade.id, id),
        eq(grade.organization_id, context.organization.id),
      ),
    });

    if (!existingGrade) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Grade not found",
      });
    }

    await database.delete(grade).where(eq(grade.id, id));

    return {
      success: true,
    };
  });

