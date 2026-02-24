import { protectedProcedure } from "../..";
import { addAssessment } from "./add-assessment";
import { deleteAssessment } from "./delete-assessment";
import { updateAssessment } from "./update-assessment";
import { listAssessments } from "./list-assessments";
import { getAssessment } from "./get-assessment";
import { publishAssessment } from "./publish-assessment";
import { unpublishAssessment } from "./unpublish-assessment";

export const assessmentRouter = protectedProcedure
  .prefix("/assessment")
  .router({
    addAssessment,
    deleteAssessment,
    updateAssessment,
    listAssessments,
    getAssessment,
    publishAssessment,
    unpublishAssessment,
  });

