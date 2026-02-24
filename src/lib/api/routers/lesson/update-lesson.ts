import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { lesson, module as moduleTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateLessonInputSchema = z.object({
  body: z.object({
    module_id: z.uuid().optional(),
    title: z.string().min(1).optional(),
    type: z.enum(["video", "pdf", "text"]).optional(),
    url: z.string().optional(),
    body: z.string().optional(),
    order: z.coerce.number().int().nonnegative().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateLesson = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateLessonInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
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

    const canUpdateLesson = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          lesson: ["update"],
        },
      },
    });

    if (!canUpdateLesson.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a lesson",
      });
    }

    if (body.module_id) {
      const targetModule = await database.query.module.findFirst({
        where: eq(moduleTable.id, body.module_id),
        with: {
          course: true,
        },
      });

      if (!targetModule) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Module not found",
        });
      }

      if (targetModule.course.organization_id !== context.organization.id) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Module not found",
        });
      }
    }

    await database
      .update(lesson)
      .set({
        module_id: body.module_id ?? existingLesson.module_id,
        title: body.title ?? existingLesson.title,
        type: body.type ?? existingLesson.type,
        url: body.url ?? existingLesson.url,
        body: body.body ?? existingLesson.body,
        order: body.order ?? existingLesson.order,
      })
      .where(eq(lesson.id, id));

    return {
      success: true,
    };
  });

