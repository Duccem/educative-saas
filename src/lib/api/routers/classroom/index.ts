import { protectedProcedure } from "../..";
import { addClassroom } from "./add-classroom";
import { deleteClassroom } from "./delete-classroom";
import { updateClassroom } from "./update-classroom";
import { listClassrooms } from "./list-classrooms";
import { getClassroom } from "./get-classroom";

export const classroomRouter = protectedProcedure.prefix("/classroom").router({
  addClassroom,
  deleteClassroom,
  updateClassroom,
  listClassrooms,
  getClassroom,
});

