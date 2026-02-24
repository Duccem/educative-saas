import { protectedProcedure } from "../..";
import { addModule } from "./add-module";
import { deleteModule } from "./delete-module";
import { updateModule } from "./update-module";
import { listModules } from "./list-modules";
import { getModule } from "./get-module";

export const moduleRouter = protectedProcedure.prefix("/public").router({
  addModule,
  deleteModule,
  updateModule,
  listModules,
  getModule,
});

