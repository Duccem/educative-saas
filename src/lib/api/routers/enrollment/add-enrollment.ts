import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { course, enrollment } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const enrollmentInputSchema = z.object({
  course_id: z.uuid(),
  student_id: z.uuid(),
  status: z.enum(["active", "completed", "dropped"]).optional(),
});

export const addEnrollment = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: enrollmentInputSchema,
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

    const existingCourse = await database.query.course.findFirst({
      where: and(
        eq(course.id, body.course_id),
        eq(course.organization_id, context.organization.id),
      ),
    });

    if (!existingCourse) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course not found",
      });
    }

    const existingEnrollment = await database.query.enrollment.findFirst({
      where: and(
        eq(enrollment.course_id, body.course_id),
        eq(enrollment.student_id, body.student_id),
        eq(enrollment.organization_id, context.organization.id),
      ),
    });

    if (existingEnrollment) {
      throw new ORPCError("CONFLICT", {
        cause: "The student is already enrolled in this course",
      });
    }

    await database.insert(enrollment).values({
      course_id: body.course_id,
      student_id: body.student_id,
      organization_id: context.organization.id,
      status: body.status ?? "active",
    });

    return {
      success: true,
    };
  });

