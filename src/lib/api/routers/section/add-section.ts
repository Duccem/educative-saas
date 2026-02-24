import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { grade, section } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const sectionInputSchema = z.object({
  name: z.string().min(1),
  grade_id: z.uuid(),
  description: z.string().optional(),
  max_students: z.coerce.number().int().positive().optional(),
});

export const addSection = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: sectionInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddSection = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          section: ["create"],
        },
      },
    });

    if (!canAddSection.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a section",
      });
    }

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

    await database.insert(section).values({
      name: body.name,
      grade_id: body.grade_id,
      description: body.description,
      max_students: body.max_students,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

