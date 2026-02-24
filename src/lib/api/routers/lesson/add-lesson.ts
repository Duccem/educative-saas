import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { lesson, module as moduleTable } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";

const lessonInputSchema = z.object({
  module_id: z.uuid(),
  title: z.string().min(1),
  type: z.enum(["video", "pdf", "text"]),
  url: z.string().optional(),
  body: z.string().optional(),
  order: z.coerce.number().int().nonnegative(),
});

export const addLesson = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: lessonInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddLesson = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          lesson: ["create"],
        },
      },
    });

    if (!canAddLesson.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a lesson",
      });
    }

    const existingModule = await database.query.module.findFirst({
      where: eq(moduleTable.id, body.module_id),
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

    await database.insert(lesson).values({
      module_id: body.module_id,
      title: body.title,
      type: body.type,
      url: body.url,
      body: body.body,
      order: body.order,
    });

    return {
      success: true,
    };
  });

