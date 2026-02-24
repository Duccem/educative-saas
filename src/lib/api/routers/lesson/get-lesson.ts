import z from "zod";
import { protectedProcedure } from "../..";
import { eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { lesson } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getLesson = protectedProcedure
  .route({ method: "GET", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;

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

    return {
      lesson: existingLesson,
    };
  });

