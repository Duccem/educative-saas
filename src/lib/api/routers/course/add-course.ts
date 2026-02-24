import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { course } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

const courseInputSchema = z.object({
  name: z.string().min(1),
  subject_id: z.uuid(),
  academic_term_id: z.uuid(),
  teacher_id: z.uuid(),
});

export const addCourse = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: courseInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddCourse = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          course: ["create"],
        },
      },
    });

    if (!canAddCourse.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a course",
      });
    }

    await database.insert(course).values({
      name: body.name,
      subject_id: body.subject_id,
      academic_term_id: body.academic_term_id,
      teacher_id: body.teacher_id,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

