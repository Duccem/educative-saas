import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { enrollment } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const listEnrolledCourses = tool({
  description:
    "List the student's enrolled courses in the current organization, including teacher, subject, and term details.",
  inputSchema: z.object({
    status: z.enum(["active", "completed", "dropped"]).optional(),
    term: z.string().min(1).optional(),
  }),
  execute: async (input, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    const whereConditions = [
      eq(enrollment.organization_id, organizationId),
      eq(enrollment.student_id, userId),
    ];

    if (input.status) {
      whereConditions.push(eq(enrollment.status, input.status));
    }

    const enrollments = await database.query.enrollment.findMany({
      where: and(...whereConditions),
      with: {
        course: {
          with: {
            subject: true,
            teacher: true,
            academicTerm: true,
          },
        },
      },
    });

    const normalizedTerm = input.term?.trim().toLowerCase();

    const items = enrollments
      .map((entry) => ({
        enrollmentId: entry.id,
        status: entry.status,
        finalScore: entry.final_score,
        finalLetter: entry.final_letter,
        isPassing: entry.is_passing,
        course: {
          id: entry.course.id,
          name: entry.course.name,
          subject: entry.course.subject.name,
          teacher: entry.course.teacher.name,
          term: entry.course.academicTerm.name,
        },
      }))
      .filter((item) => {
        if (!normalizedTerm) return true;

        return (
          item.course.name.toLowerCase().includes(normalizedTerm) ||
          item.course.subject.toLowerCase().includes(normalizedTerm) ||
          item.course.teacher.toLowerCase().includes(normalizedTerm)
        );
      });

    return {
      total: items.length,
      items,
    };
  },
});

