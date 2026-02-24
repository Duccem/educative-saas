import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
  academic_term_id: uuid("academic_term_id")
    .notNull()
    .references(() => academic_term.id),
  name: text("name").notNull(),
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

