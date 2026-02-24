import { protectedProcedure } from "../..";
import { addClassAttendance } from "./add-class-attendance";
import { deleteClassAttendance } from "./delete-class-attendance";
import { updateClassAttendance } from "./update-class-attendance";
import { listClassAttendance } from "./list-class-attendance";
import { getClassAttendance } from "./get-class-attendance";

export const classAttendanceRouter = protectedProcedure
  .prefix("/public")
  .router({
    addClassAttendance,
    deleteClassAttendance,
    updateClassAttendance,
    listClassAttendance,
    getClassAttendance,
  });

