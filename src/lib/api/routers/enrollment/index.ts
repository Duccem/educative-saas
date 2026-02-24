import { protectedProcedure } from "../..";
import { addEnrollment } from "./add-enrollment";
import { addSectionEnrollment } from "./add-section-enrollment";

export const enrollmentRouter = protectedProcedure
  .prefix("/enrollment")
  .router({
    addEnrollment,
    addSectionEnrollment,
  });

