import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { course_final_grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteCourseFinalGrade = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const canDeleteFinalGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          course_final_grade: ["delete"],
        },
      },
    });

    if (!canDeleteFinalGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete final grades",
      });
    }

    const existingFinalGrade =
      await database.query.course_final_grade.findFirst({
        where: and(
          eq(course_final_grade.id, params.id),
          eq(course_final_grade.organization_id, context.organization.id),
        ),
      });

    if (!existingFinalGrade) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course final grade not found",
      });
    }

    await database
      .delete(course_final_grade)
      .where(eq(course_final_grade.id, params.id));

    return {
      success: true,
    };
  });

