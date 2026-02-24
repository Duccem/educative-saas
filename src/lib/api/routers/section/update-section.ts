import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { grade, section } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateSectionInputSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    grade_id: z.uuid().optional(),
    description: z.string().optional(),
    max_students: z.coerce.number().int().positive().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateSection = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateSectionInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;
    const existingSection = await database.query.section.findFirst({
      where: and(
        eq(section.id, id),
        eq(section.organization_id, context.organization.id),
      ),
    });

    if (!existingSection) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Section not found",
      });
    }

    const canUpdateSection = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          section: ["update"],
        },
      },
    });

    if (!canUpdateSection.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a section",
      });
    }

    if (body.grade_id) {
      const existingGrade = await database.query.grade.findFirst({
        where: and(
          eq(grade.id, body.grade_id),
          eq(grade.organization_id, context.organization.id),
        ),
      });

      if (!existingGrade) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Grade not found",
        });
      }
    }

    await database
      .update(section)
      .set({
        name: body.name ?? existingSection.name,
        grade_id: body.grade_id ?? existingSection.grade_id,
        description: body.description ?? existingSection.description,
        max_students: body.max_students ?? existingSection.max_students,
      })
      .where(eq(section.id, id));

    return {
      success: true,
    };
  });

