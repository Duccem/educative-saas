import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { grade } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateGradeInputSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    level: z.coerce.number().int().optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateGrade = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateGradeInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;
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

    const canUpdateGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          grade: ["update"],
        },
      },
    });

    if (!canUpdateGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a grade",
      });
    }

    await database
      .update(grade)
      .set({
        name: body.name ?? existingGrade.name,
        level: body.level ?? existingGrade.level,
        description: body.description ?? existingGrade.description,
      })
      .where(eq(grade.id, id));

    return {
      success: true,
    };
  });

