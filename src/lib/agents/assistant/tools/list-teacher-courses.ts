import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { course } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const listTeacherCourses = tool({
  description:
    "List the teacher's courses in the current organization, including subject, grade, section, and term.",
  inputSchema: z.object({
    term: z.string().min(1).optional(),
  }),
  execute: async ({ term }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    const courses = await database.query.course.findMany({
      where: and(
        eq(course.organization_id, organizationId),
        eq(course.teacher_id, userId),
      ),
      with: {
        subject: true,
        grade: true,
        section: true,
        academicTerm: true,
      },
    });

    const normalizedTerm = term?.trim().toLowerCase();

    const items = courses
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        subject: entry.subject.name,
        grade: entry.grade?.name ?? null,
        section: entry.section?.name ?? null,
        academicTerm: entry.academicTerm.name,
      }))
      .filter((item) => {
        if (!normalizedTerm) return true;

        return (
          item.name.toLowerCase().includes(normalizedTerm) ||
          item.subject.toLowerCase().includes(normalizedTerm) ||
          item.academicTerm.toLowerCase().includes(normalizedTerm)
        );
      });

    return {
      total: items.length,
      items,
    };
  },
});

