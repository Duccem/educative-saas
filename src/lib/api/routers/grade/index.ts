import { protectedProcedure } from "../..";
import { addGrade } from "./add-grade";
import { deleteGrade } from "./delete-grade";
import { updateGrade } from "./update-grade";
import { listGrades } from "./list-grades";
import { getGrade } from "./get-grade";

export const gradeRouter = protectedProcedure.prefix("/grade").router({
  addGrade,
  deleteGrade,
  updateGrade,
  listGrades,
  getGrade,
});

