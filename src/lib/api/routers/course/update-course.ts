import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { course } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateCourseInputSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    subject_id: z.uuid().optional(),
    academic_term_id: z.uuid().optional(),
    teacher_id: z.uuid().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateCourse = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateCourseInputSchema)
  .handler(async ({ input: { body, params } }) => {
    const { id } = params;
    const existingCourse = await database.query.course.findFirst({
      where: eq(course.id, id),
    });

    if (!existingCourse) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course not found",
      });
    }

    const canUpdateCourse = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          course: ["update"],
        },
      },
    });

    if (!canUpdateCourse.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a course",
      });
    }

    await database
      .update(course)
      .set({
        name: body.name ?? existingCourse.name,
        subject_id: body.subject_id ?? existingCourse.subject_id,
        academic_term_id:
          body.academic_term_id ?? existingCourse.academic_term_id,
        teacher_id: body.teacher_id ?? existingCourse.teacher_id,
      })
      .where(eq(course.id, id));

    return {
      success: true,
    };
  });

