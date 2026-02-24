import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization, user } from "./auth";

export const academic_term = pgTable("academic_term", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  name: text("name").notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  is_active: boolean("is_active").notNull().default(false),
});

export const subject = pgTable("subject", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  name: text("name").notNull(),
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  description: text("description"),
});

export const course = pgTable("course", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  subject_id: uuid("subject_id")
    .notNull()
    .references(() => subject.id),
  academic_term_id: uuid("academic_term_id")
    .notNull()
    .references(() => academic_term.id),
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  teacher_id: uuid("teacher_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
});

export const enrollment_status = pgEnum("enrollment_status", [
  "active",
  "completed",
  "dropped",
]);

export const enrollment = pgTable("enrollment", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  course_id: uuid("course_id")
    .notNull()
    .references(() => course.id),
  student_id: uuid("student_id")
    .notNull()
    .references(() => user.id),
  status: enrollment_status("status").notNull().default("active"),
});

export const teacher_subject = pgTable("teacher_subject", {
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  teacher_id: uuid("teacher_id")
    .notNull()
    .references(() => user.id),
  subject_id: uuid("subject_id")
    .notNull()
    .references(() => subject.id),
});

export const academicTermRelations = relations(
  academic_term,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [academic_term.organization_id],
      references: [organization.id],
    }),
    courses: many(course),
  }),
);

export const subjectRelations = relations(subject, ({ one, many }) => ({
  courses: many(course),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
  subject: one(subject, {
    fields: [course.subject_id],
    references: [subject.id],
  }),
  academicTerm: one(academic_term, {
    fields: [course.academic_term_id],
    references: [academic_term.id],
  }),
  organization: one(organization, {
    fields: [course.organization_id],
    references: [organization.id],
  }),
  teacher: one(user, {
    fields: [course.teacher_id],
    references: [user.id],
  }),
  enrollments: many(enrollment),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  course: one(course, {
    fields: [enrollment.course_id],
    references: [course.id],
  }),
  student: one(user, {
    fields: [enrollment.student_id],
    references: [user.id],
  }),
}));

export const teacherSubjectRelations = relations(
  teacher_subject,
  ({ one }) => ({
    organization: one(organization, {
      fields: [teacher_subject.organization_id],
      references: [organization.id],
    }),
    teacher: one(user, {
      fields: [teacher_subject.teacher_id],
      references: [user.id],
    }),
    subject: one(subject, {
      fields: [teacher_subject.subject_id],
      references: [subject.id],
    }),
  }),
);

