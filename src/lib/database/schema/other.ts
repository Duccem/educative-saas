import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { organization, user } from "./auth";

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

export const parentStudentRelations = relations(parent_student, ({ one }) => ({
  organization: one(organization, {
    fields: [parent_student.organization_id],
    references: [organization.id],
  }),
  parent: one(user, {
    fields: [parent_student.parent_id],
    references: [user.id],
    relationName: "parent_student_parent",
  }),
  student: one(user, {
    fields: [parent_student.student_id],
    references: [user.id],
    relationName: "parent_student_student",
  }),
}));

