import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { member, parent_student } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const parentStudentInputSchema = z.object({
  parent_id: z.uuid(),
  student_id: z.uuid(),
});

export const addParentStudent = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: parentStudentInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddParentStudent = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          parent_student: ["create"],
        },
      },
    });

    if (!canAddParentStudent.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to link a parent with a student",
      });
    }

    const parentMember = await database.query.member.findFirst({
      where: and(
        eq(member.organizationId, context.organization.id),
        eq(member.userId, body.parent_id),
        eq(member.role, "parent"),
      ),
    });

    if (!parentMember) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Parent not found in this organization",
      });
    }

    const studentMember = await database.query.member.findFirst({
      where: and(
        eq(member.organizationId, context.organization.id),
        eq(member.userId, body.student_id),
        eq(member.role, "student"),
      ),
    });

    if (!studentMember) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Student not found in this organization",
      });
    }

    const existingLink = await database.query.parent_student.findFirst({
      where: and(
        eq(parent_student.organization_id, context.organization.id),
        eq(parent_student.parent_id, body.parent_id),
        eq(parent_student.student_id, body.student_id),
      ),
    });

    if (existingLink) {
      throw new ORPCError("CONFLICT", {
        cause: "Parent and student are already linked",
      });
    }

    await database.insert(parent_student).values({
      organization_id: context.organization.id,
      parent_id: body.parent_id,
      student_id: body.student_id,
    });

    return {
      success: true,
    };
  });

