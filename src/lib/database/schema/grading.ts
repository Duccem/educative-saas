import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization, user } from "./auth";
import { academic_term, course, enrollment } from "./course";

export const assessment_type = pgEnum("assessment_type", [
  "exam",
  "quiz",
  "assignment",
  "project",
  "participation",
  "recovery",
  "other",
]);

export const assessment = pgTable(
  "assessment",
  {
    id: uuid("id").primaryKey().$defaultFn(v7),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organization.id),
    course_id: uuid("course_id")
      .notNull()
      .references(() => course.id),
    academic_term_id: uuid("academic_term_id")
      .notNull()
      .references(() => academic_term.id),
    created_by: uuid("created_by")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    description: text("description"),
    type: assessment_type("type").notNull().default("other"),
    weight: decimal("weight", { precision: 5, scale: 2 })
      .notNull()
      .default("1.00"),
    max_score: decimal("max_score", { precision: 8, scale: 2 })
      .notNull()
      .default("100.00"),
    due_time: timestamp("due_time"),
    is_published: boolean("is_published").notNull().default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("assessment_course_idx").on(table.course_id),
    index("assessment_org_term_idx").on(
      table.organization_id,
      table.academic_term_id,
    ),
  ],
);

export const assessment_grade_status = pgEnum("assessment_grade_status", [
  "draft",
  "published",
  "excused",
  "missing",
]);

export const student_assessment_grade = pgTable(
  "student_assessment_grade",
  {
    id: uuid("id").primaryKey().$defaultFn(v7),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organization.id),
    assessment_id: uuid("assessment_id")
      .notNull()
      .references(() => assessment.id),
    enrollment_id: uuid("enrollment_id")
      .notNull()
      .references(() => enrollment.id),
    grader_id: uuid("grader_id").references(() => user.id),
    raw_score: decimal("raw_score", { precision: 8, scale: 2 })
      .notNull()
      .default("0.00"),
    extra_credit: decimal("extra_credit", { precision: 8, scale: 2 })
      .notNull()
      .default("0.00"),
    penalty_score: decimal("penalty_score", { precision: 8, scale: 2 })
      .notNull()
      .default("0.00"),
    final_score: decimal("final_score", { precision: 8, scale: 2 })
      .notNull()
      .default("0.00"),
    feedback: text("feedback"),
    status: assessment_grade_status("status").notNull().default("draft"),
    graded_at: timestamp("graded_at").notNull().defaultNow(),
    published_at: timestamp("published_at"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("student_assessment_grade_unique").on(
      table.assessment_id,
      table.enrollment_id,
    ),
    index("student_assessment_grade_enrollment_idx").on(table.enrollment_id),
  ],
);

export const course_final_grade_status = pgEnum("course_final_grade_status", [
  "in_progress",
  "finalized",
  "published",
]);

export const course_final_grade = pgTable(
  "course_final_grade",
  {
    id: uuid("id").primaryKey().$defaultFn(v7),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organization.id),
    course_id: uuid("course_id")
      .notNull()
      .references(() => course.id),
    enrollment_id: uuid("enrollment_id")
      .notNull()
      .references(() => enrollment.id),
    student_id: uuid("student_id")
      .notNull()
      .references(() => user.id),
    final_score: decimal("final_score", { precision: 8, scale: 2 })
      .notNull()
      .default("0.00"),
    final_letter: text("final_letter"),
    is_passing: boolean("is_passing").notNull().default(false),
    status: course_final_grade_status("status")
      .notNull()
      .default("in_progress"),
    notes: text("notes"),
    calculated_at: timestamp("calculated_at").notNull().defaultNow(),
    published_at: timestamp("published_at"),
    locked_at: timestamp("locked_at"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("course_final_grade_enrollment_unique").on(table.enrollment_id),
    index("course_final_grade_course_idx").on(table.course_id),
    index("course_final_grade_student_idx").on(table.student_id),
  ],
);

export const assessmentRelations = relations(assessment, ({ one, many }) => ({
  organization: one(organization, {
    fields: [assessment.organization_id],
    references: [organization.id],
  }),
  course: one(course, {
    fields: [assessment.course_id],
    references: [course.id],
  }),
  academicTerm: one(academic_term, {
    fields: [assessment.academic_term_id],
    references: [academic_term.id],
  }),
  creator: one(user, {
    fields: [assessment.created_by],
    references: [user.id],
  }),
  grades: many(student_assessment_grade),
}));

export const studentAssessmentGradeRelations = relations(
  student_assessment_grade,
  ({ one }) => ({
    organization: one(organization, {
      fields: [student_assessment_grade.organization_id],
      references: [organization.id],
    }),
    assessment: one(assessment, {
      fields: [student_assessment_grade.assessment_id],
      references: [assessment.id],
    }),
    enrollment: one(enrollment, {
      fields: [student_assessment_grade.enrollment_id],
      references: [enrollment.id],
    }),
    grader: one(user, {
      fields: [student_assessment_grade.grader_id],
      references: [user.id],
    }),
  }),
);

export const courseFinalGradeRelations = relations(
  course_final_grade,
  ({ one }) => ({
    organization: one(organization, {
      fields: [course_final_grade.organization_id],
      references: [organization.id],
    }),
    course: one(course, {
      fields: [course_final_grade.course_id],
      references: [course.id],
    }),
    enrollment: one(enrollment, {
      fields: [course_final_grade.enrollment_id],
      references: [enrollment.id],
    }),
    student: one(user, {
      fields: [course_final_grade.student_id],
      references: [user.id],
    }),
  }),
);

