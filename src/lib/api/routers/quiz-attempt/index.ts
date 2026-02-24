import { protectedProcedure } from "../..";
import { addQuizAttempt } from "./add-quiz-attempt";
import { deleteQuizAttempt } from "./delete-quiz-attempt";
import { updateQuizAttempt } from "./update-quiz-attempt";
import { listQuizAttempts } from "./list-quiz-attempts";
import { getQuizAttempt } from "./get-quiz-attempt";

export const quizAttemptRouter = protectedProcedure
  .prefix("/quiz-attempt")
  .router({
    addQuizAttempt,
    deleteQuizAttempt,
    updateQuizAttempt,
    listQuizAttempts,
    getQuizAttempt,
  });

