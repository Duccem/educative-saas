import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { user } from "./auth";
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

export const quizRelations = relations(quiz, ({ one, many }) => ({
  course: one(course, {
    fields: [quiz.course_id],
    references: [course.id],
  }),
  questions: many(question),
  attempts: many(quiz_attempt),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
  quiz: one(quiz, {
    fields: [question.quiz_id],
    references: [quiz.id],
  }),
  responses: many(quiz_response),
}));

export const quizAttemptRelations = relations(
  quiz_attempt,
  ({ one, many }) => ({
    quiz: one(quiz, {
      fields: [quiz_attempt.quiz_id],
      references: [quiz.id],
    }),
    student: one(user, {
      fields: [quiz_attempt.student_id],
      references: [user.id],
    }),
    responses: many(quiz_response),
  }),
);

export const quizResponseRelations = relations(quiz_response, ({ one }) => ({
  attempt: one(quiz_attempt, {
    fields: [quiz_response.quiz_attempt_id],
    references: [quiz_attempt.id],
  }),
  question: one(question, {
    fields: [quiz_response.question_id],
    references: [question.id],
  }),
}));

