import { protectedProcedure } from "../..";
import { addCourse } from "./add-course";
import { deleteCourse } from "./delete-course";
import { updateCourse } from "./update-course";
import { listCourses } from "./list-courses";
import { getCourse } from "./get-course";

export const courseRouter = protectedProcedure.prefix("/public").router({
  addCourse,
  deleteCourse,
  updateCourse,
  listCourses,
  getCourse,
});

