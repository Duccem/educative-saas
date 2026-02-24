import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { course } from "./course";

export const module = pgTable("module", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  course_id: uuid("course_id")
    .notNull()
    .references(() => course.id),
  title: text("title").notNull(),
  order: integer("order").notNull(),
});

export const lesson_type = pgEnum("lesson_type", ["video", "pdf", "text"]);

export const lesson = pgTable("lesson", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  module_id: uuid("module_id")
    .notNull()
    .references(() => module.id),
  title: text("title").notNull(),
  type: lesson_type("video").notNull(),
  url: text("url"),
  body: text("body"),
  order: integer("order").notNull(),
});

export const moduleRelations = relations(module, ({ one, many }) => ({
  course: one(course, {
    fields: [module.course_id],
    references: [course.id],
  }),
  lessons: many(lesson),
}));

export const lessonRelations = relations(lesson, ({ one }) => ({
  module: one(module, {
    fields: [lesson.module_id],
    references: [module.id],
  }),
}));

