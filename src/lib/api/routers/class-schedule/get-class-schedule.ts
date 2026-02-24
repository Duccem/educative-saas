import z from "zod";
import { protectedProcedure } from "../..";
import { eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { class_schedule } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getClassSchedule = protectedProcedure
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

    const existingClassSchedule = await database.query.class_schedule.findFirst(
      {
        where: eq(class_schedule.id, id),
        with: {
          course: true,
          classroom: true,
        },
      },
    );

    if (!existingClassSchedule) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Class schedule not found",
      });
    }

    if (existingClassSchedule.organization_id !== context.organization.id) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Class schedule not found",
      });
    }

    return {
      classSchedule: existingClassSchedule,
    };
  });

