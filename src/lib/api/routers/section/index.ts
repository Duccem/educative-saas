import { protectedProcedure } from "../..";
import { addSection } from "./add-section";
import { deleteSection } from "./delete-section";
import { updateSection } from "./update-section";
import { listSections } from "./list-sections";
import { getSection } from "./get-section";

export const sectionRouter = protectedProcedure.prefix("/section").router({
  addSection,
  deleteSection,
  updateSection,
  listSections,
  getSection,
});

