import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { course, module as moduleTable } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const moduleInputSchema = z.object({
  course_id: z.uuid(),
  title: z.string().min(1),
  order: z.coerce.number().int().nonnegative(),
});

export const addModule = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: moduleInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddModule = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          module: ["create"],
        },
      },
    });

    if (!canAddModule.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a module",
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

    await database.insert(moduleTable).values({
      course_id: body.course_id,
      title: body.title,
      order: body.order,
    });

    return {
      success: true,
    };
  });

