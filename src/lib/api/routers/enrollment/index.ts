import { protectedProcedure } from "../..";
import { addEnrollment } from "./add-enrollment";

export const enrollmentRouter = protectedProcedure
  .prefix("/enrollment")
  .router({
    addEnrollment,
  });

