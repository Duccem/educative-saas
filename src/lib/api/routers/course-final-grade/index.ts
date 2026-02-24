import { protectedProcedure } from "../..";
import { addCourseFinalGrade } from "./add-course-final-grade";
import { deleteCourseFinalGrade } from "./delete-course-final-grade";
import { updateCourseFinalGrade } from "./update-course-final-grade";
import { listCourseFinalGrades } from "./list-course-final-grades";
import { getCourseFinalGrade } from "./get-course-final-grade";
import { upsertCourseFinalGrade } from "./upsert-course-final-grade";
import { publishCourseFinalGrade } from "./publish-course-final-grade";
import { finalizeCourseFinalGrade } from "./finalize-course-final-grade";

export const courseFinalGradeRouter = protectedProcedure
  .prefix("/course-final-grade")
  .router({
    addCourseFinalGrade,
    deleteCourseFinalGrade,
    updateCourseFinalGrade,
    listCourseFinalGrades,
    getCourseFinalGrade,
    upsertCourseFinalGrade,
    publishCourseFinalGrade,
    finalizeCourseFinalGrade,
  });

