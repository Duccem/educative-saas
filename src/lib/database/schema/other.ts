import { pgTable, uuid } from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { subject } from "./course";

export const parent_student = pgTable("parent_student", {
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  parent_id: uuid("parent_id")
    .notNull()
    .references(() => user.id),
  student_id: uuid("student_id")
    .notNull()
    .references(() => user.id),
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

