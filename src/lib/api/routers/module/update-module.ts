import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { course, module as moduleTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateModuleInputSchema = z.object({
  body: z.object({
    course_id: z.uuid().optional(),
    title: z.string().min(1).optional(),
    order: z.coerce.number().int().nonnegative().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateModule = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateModuleInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;
    const existingModule = await database.query.module.findFirst({
      where: eq(moduleTable.id, id),
      with: {
        course: true,
      },
    });

    if (!existingModule) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Module not found",
      });
    }

    if (existingModule.course.organization_id !== context.organization.id) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Module not found",
      });
    }

    const canUpdateModule = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          module: ["update"],
        },
      },
    });

    if (!canUpdateModule.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a module",
      });
    }

    if (body.course_id) {
      const targetCourse = await database.query.course.findFirst({
        where: and(
          eq(course.id, body.course_id),
          eq(course.organization_id, context.organization.id),
        ),
      });

      if (!targetCourse) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Course not found",
        });
      }
    }

    await database
      .update(moduleTable)
      .set({
        course_id: body.course_id ?? existingModule.course_id,
        title: body.title ?? existingModule.title,
        order: body.order ?? existingModule.order,
      })
      .where(eq(moduleTable.id, id));

    return {
      success: true,
    };
  });

