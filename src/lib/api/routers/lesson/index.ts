import { protectedProcedure } from "../..";
import { addLesson } from "./add-lesson";
import { deleteLesson } from "./delete-lesson";
import { updateLesson } from "./update-lesson";
import { listLessons } from "./list-lessons";
import { getLesson } from "./get-lesson";

export const lessonRouter = protectedProcedure.prefix("/public").router({
  addLesson,
  deleteLesson,
  updateLesson,
  listLessons,
  getLesson,
});

