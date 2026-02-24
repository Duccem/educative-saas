import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { section, section_enrollment } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const sectionEnrollmentInputSchema = z.object({
  section_id: z.uuid(),
  student_id: z.uuid(),
  status: z.enum(["active", "completed", "dropped"]).optional(),
});

export const addSectionEnrollment = protectedProcedure
  .route({ method: "POST", path: "/section", inputStructure: "detailed" })
  .input(
    z.object({
      body: sectionEnrollmentInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddEnrollment = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          enrollment: ["create"],
        },
      },
    });

    if (!canAddEnrollment.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add an enrollment",
      });
    }

    const existingSection = await database.query.section.findFirst({
      where: and(
        eq(section.id, body.section_id),
        eq(section.organization_id, context.organization.id),
      ),
    });

    if (!existingSection) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Section not found",
      });
    }

    const existingSectionEnrollment =
      await database.query.section_enrollment.findFirst({
        where: and(
          eq(section_enrollment.section_id, body.section_id),
          eq(section_enrollment.student_id, body.student_id),
          eq(section_enrollment.organization_id, context.organization.id),
        ),
      });

    if (existingSectionEnrollment) {
      throw new ORPCError("CONFLICT", {
        cause: "The student is already enrolled in this section",
      });
    }

    await database.insert(section_enrollment).values({
      section_id: body.section_id,
      student_id: body.student_id,
      organization_id: context.organization.id,
      status: body.status ?? "active",
    });

    return {
      success: true,
    };
  });

