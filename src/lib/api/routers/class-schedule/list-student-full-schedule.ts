import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq, inArray } from "drizzle-orm";
import { database } from "@/lib/database";
import {
  class_attendance,
  class_schedule,
  course,
  enrollment,
} from "@/lib/database/schema";

async function getStudentScheduleById(
  studentId: string,
  organizationId: string,
) {
  const studentEnrollments = await database.query.enrollment.findMany({
    where: and(
      eq(enrollment.student_id, studentId),
      eq(enrollment.organization_id, organizationId),
    ),
    columns: { course_id: true },
  });

  const enrolledCourseIds = Array.from(
    new Set(studentEnrollments.map((item) => item.course_id)),
  );

  if (enrolledCourseIds.length === 0) {
    return [];
  }

  return database.query.class_schedule.findMany({
    where: inArray(class_schedule.course_id, enrolledCourseIds),
    with: {
      course: true,
      classroom: true,
      attendanceRecords: {
        where: eq(class_attendance.student_id, studentId),
      },
    },
  });
}

export const listStudentFullSchedule = protectedProcedure
  .route({
    method: "GET",
    path: "/full/:student_id",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: z.object({
        student_id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const items = await getStudentScheduleById(
      params.student_id,
      context.organization.id,
    );

    return {
      studentId: params.student_id,
      items,
    };
  });

export const listMyFullSchedule = protectedProcedure
  .route({
    method: "GET",
    path: "/full",
    inputStructure: "detailed",
  })
  .handler(async ({ context }) => {
    const studentId = context.session.user.id;
    const items = await getStudentScheduleById(
      studentId,
      context.organization.id,
    );

    return {
      studentId,
      items,
    };
  });

