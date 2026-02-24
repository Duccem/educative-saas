import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization, user } from "./auth";
import { course } from "./course";

export const classroom = pgTable("classroom", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  is_virtual: boolean("is_virtual").notNull().default(false),
});

export const class_schedule = pgTable("class_schedule", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  course_id: uuid("course_id")
    .notNull()
    .references(() => course.id),
  classroom_id: uuid("classroom_id")
    .notNull()
    .references(() => classroom.id),
  day_of_week: integer("day_of_week").notNull(), // 0 (Sunday) to 6 (Saturday)
  start_time: text("start_time").notNull(), // Format: "HH:MM"
  end_time: text("end_time").notNull(), // Format: "HH:MM"
});

export const class_attendance = pgTable("class_attendance", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  class_schedule_id: uuid("class_schedule_id")
    .notNull()
    .references(() => class_schedule.id),
  student_id: uuid("student_id")
    .notNull()
    .references(() => user.id),
  attendance_date: text("attendance_date").notNull(), // Format: "YYYY-MM-DD"
  status: text("status").notNull(), // e.g., "present", "absent", "late"
});

export const classroomRelations = relations(classroom, ({ one, many }) => ({
  organization: one(organization, {
    fields: [classroom.organization_id],
    references: [organization.id],
  }),
  schedules: many(class_schedule),
}));

export const classScheduleRelations = relations(
  class_schedule,
  ({ one, many }) => ({
    course: one(course, {
      fields: [class_schedule.course_id],
      references: [course.id],
    }),
    classroom: one(classroom, {
      fields: [class_schedule.classroom_id],
      references: [classroom.id],
    }),
    attendanceRecords: many(class_attendance),
  }),
);

export const classAttendanceRelations = relations(
  class_attendance,
  ({ one }) => ({
    schedule: one(class_schedule, {
      fields: [class_attendance.class_schedule_id],
      references: [class_schedule.id],
    }),
    student: one(user, {
      fields: [class_attendance.student_id],
      references: [user.id],
    }),
  }),
);

