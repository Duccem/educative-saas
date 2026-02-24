import { protectedProcedure } from "../..";
import { addStudentAssessmentGrade } from "./add-student-assessment-grade";
import { deleteStudentAssessmentGrade } from "./delete-student-assessment-grade";
import { updateStudentAssessmentGrade } from "./update-student-assessment-grade";
import { listStudentAssessmentGrades } from "./list-student-assessment-grades";
import { getStudentAssessmentGrade } from "./get-student-assessment-grade";
import { upsertStudentAssessmentGrade } from "./upsert-student-assessment-grade";
import { publishAssessmentGrades } from "./publish-assessment-grades";

export const studentAssessmentGradeRouter = protectedProcedure
  .prefix("/student-assessment-grade")
  .router({
    addStudentAssessmentGrade,
    deleteStudentAssessmentGrade,
    updateStudentAssessmentGrade,
    listStudentAssessmentGrades,
    getStudentAssessmentGrade,
    upsertStudentAssessmentGrade,
    publishAssessmentGrades,
  });

