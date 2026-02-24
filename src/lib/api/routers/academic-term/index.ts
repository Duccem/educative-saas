import { protectedProcedure } from "../..";
import { addAcademicTerm } from "./add-academic-term";
import { deleteAcademicTerm } from "./delete-academic-term";
import { updateAcademicTerm } from "./update-academic-term";
import { listAcademicTerms } from "./list-academic-terms";
import { getAcademicTerm } from "./get-academic-term";

export const academicTermRouter = protectedProcedure.prefix("/public").router({
  addAcademicTerm,
  deleteAcademicTerm,
  updateAcademicTerm,
  listAcademicTerms,
  getAcademicTerm,
});

