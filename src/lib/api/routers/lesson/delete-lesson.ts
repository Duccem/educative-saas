import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { eq } from "drizzle-orm";
import { lesson } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteLesson = protectedProcedure
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

    const canDeleteLesson = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          lesson: ["delete"],
        },
      },
    });

    if (!canDeleteLesson.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a lesson",
      });
    }

    const existingLesson = await database.query.lesson.findFirst({
      where: eq(lesson.id, id),
      with: {
        module: {
          with: {
            course: true,
          },
        },
      },
    });

    if (!existingLesson) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Lesson not found",
      });
    }

    if (
      existingLesson.module.course.organization_id !== context.organization.id
    ) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Lesson not found",
      });
    }

    await database.delete(lesson).where(eq(lesson.id, id));

    return {
      success: true,
    };
  });

