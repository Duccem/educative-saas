import { protectedProcedure } from "../..";
import { addSubject } from "./add-subject";
import { deleteSubject } from "./delete-subject";
import { updateSubject } from "./update-subject";
import { listSubjects } from "./list-subjects";
import { getSubject } from "./get-subject";

export const subjectRouter = protectedProcedure.prefix("/public").router({
  addSubject,
  deleteSubject,
  updateSubject,
  listSubjects,
  getSubject,
});

