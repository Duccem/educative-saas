import { protectedProcedure } from "../..";
import { addParentStudent } from "./add-parent-student";

export const parentStudentRouter = protectedProcedure
  .prefix("/parent-student")
  .router({
    addParentStudent,
  });

