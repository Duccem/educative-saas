import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { course } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getCourse = protectedProcedure
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
    const { organization } = context;

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

    return {
      course: existingCourse,
    };
  });

