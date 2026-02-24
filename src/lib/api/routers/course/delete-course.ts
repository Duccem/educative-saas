import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { course } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteCourse = protectedProcedure
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
    const { organization } = context;

    const canDeleteCourse = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          course: ["delete"],
        },
      },
    });

    if (!canDeleteCourse.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a course",
      });
    }

    const existingCourse = await database.query.course.findFirst({
      where: and(
        eq(course.id, id),
        eq(course.organization_id, organization.id),
      ),
    });

    if (!existingCourse) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course not found",
      });
    }

    await database.delete(course).where(eq(course.id, id));

    return {
      success: true,
    };
  });

