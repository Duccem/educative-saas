import { protectedProcedure } from "../..";
import { addQuizResponse } from "./add-quiz-response";
import { deleteQuizResponse } from "./delete-quiz-response";
import { updateQuizResponse } from "./update-quiz-response";
import { listQuizResponses } from "./list-quiz-responses";
import { getQuizResponse } from "./get-quiz-response";

export const quizResponseRouter = protectedProcedure
  .prefix("/quiz-response")
  .router({
    addQuizResponse,
    deleteQuizResponse,
    updateQuizResponse,
    listQuizResponses,
    getQuizResponse,
  });

