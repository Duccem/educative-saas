import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { course } from "./course";

export const quiz = pgTable("quiz", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  course_id: uuid("course_id")
    .notNull()
    .references(() => course.id),
  title: text("title").notNull(),
  description: text("description"),
  weight: decimal("weight", { precision: 2 }).notNull().default("1.00"),
  due_time: timestamp("due_time"),
});

export const question = pgTable("question", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  quiz_id: uuid("quiz_id")
    .notNull()
    .references(() => quiz.id),
  text: text("text").notNull(),
  options: text("options").array().default([]),
  correct_option: integer("correct_option").notNull(),
  value: decimal("value", { precision: 2 }).notNull().default("1.00"),
});

export const quiz_attempt = pgTable("quiz_attempt", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  quiz_id: uuid("quiz_id")
    .notNull()
    .references(() => quiz.id),
  student_id: uuid("student_id").notNull(),
  score: decimal("score", { precision: 2 }).notNull().default("0.00"),
  feedback: text("feedback"),
  attempt_time: timestamp("attempt_time").notNull().defaultNow(),
});

export const quiz_response = pgTable("quiz_response", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  quiz_attempt_id: uuid("quiz_attempt_id")
    .notNull()
    .references(() => quiz_attempt.id),
  question_id: uuid("question_id")
    .notNull()
    .references(() => question.id),
  selected_option: integer("selected_option").notNull(),
});

