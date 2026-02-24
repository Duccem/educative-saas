import { protectedProcedure } from "../..";
import { addQuiz } from "./add-quiz";
import { deleteQuiz } from "./delete-quiz";
import { updateQuiz } from "./update-quiz";
import { listQuizzes } from "./list-quizzes";
import { getQuiz } from "./get-quiz";

export const quizRouter = protectedProcedure.prefix("/quiz").router({
  addQuiz,
  deleteQuiz,
  updateQuiz,
  listQuizzes,
  getQuiz,
});

