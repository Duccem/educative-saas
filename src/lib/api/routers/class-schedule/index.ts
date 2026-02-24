import { protectedProcedure } from "../..";
import { addClassSchedule } from "./add-class-schedule";
import { deleteClassSchedule } from "./delete-class-schedule";
import { updateClassSchedule } from "./update-class-schedule";
import { listClassSchedules } from "./list-class-schedules";
import { getClassSchedule } from "./get-class-schedule";
import {
  listMyFullSchedule,
  listStudentFullSchedule,
} from "./list-student-full-schedule";

export const classScheduleRouter = protectedProcedure
  .prefix("/schedule")
  .router({
    addClassSchedule,
    deleteClassSchedule,
    updateClassSchedule,
    listClassSchedules,
    getClassSchedule,
    listStudentFullSchedule,
    listMyFullSchedule,
  });

