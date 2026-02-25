import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { enrollment, quiz_attempt, quiz_response } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const getQuizPerformance = tool({
  description:
    "Summarize quiz performance for the student, optionally scoped to a course or a specific quiz.",
  inputSchema: z.object({
    courseId: z.uuid().optional(),
    quizId: z.uuid().optional(),
  }),
  execute: async ({ courseId, quizId }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    if (courseId) {
      const studentEnrollment = await database.query.enrollment.findFirst({
        where: and(
          eq(enrollment.organization_id, organizationId),
          eq(enrollment.student_id, userId),
          eq(enrollment.course_id, courseId),
        ),
      });

      if (!studentEnrollment) {
        return {
          error: "You are not enrolled in the requested course.",
        };
      }
    }

    const attempts = await database.query.quiz_attempt.findMany({
      where: and(
        eq(quiz_attempt.organization_id, organizationId),
        eq(quiz_attempt.student_id, userId),
      ),
      with: {
        quiz: true,
      },
    });

    const filteredAttempts = attempts
      .filter((attempt) =>
        courseId ? attempt.quiz.course_id === courseId : true,
      )
      .filter((attempt) => (quizId ? attempt.quiz_id === quizId : true));

    if (filteredAttempts.length === 0) {
      return {
        totalAttempts: 0,
        byQuiz: [],
        latestAttemptReview: null,
      };
    }

    const byQuiz = Object.values(
      filteredAttempts.reduce<
        Record<
          string,
          {
            quizId: string;
            quizTitle: string;
            courseId: string;
            attempts: number;
            averageScore: number;
            bestScore: number;
            latestScore: number;
            latestAttemptTime: Date;
          }
        >
      >((accumulator, current) => {
        const score = Number(current.score);
        const entry = accumulator[current.quiz_id];

        if (!entry) {
          accumulator[current.quiz_id] = {
            quizId: current.quiz_id,
            quizTitle: current.quiz.title,
            courseId: current.quiz.course_id,
            attempts: 1,
            averageScore: score,
            bestScore: score,
            latestScore: score,
            latestAttemptTime: current.attempt_time,
          };
          return accumulator;
        }

        entry.attempts += 1;
        entry.averageScore =
          (entry.averageScore * (entry.attempts - 1) + score) / entry.attempts;
        entry.bestScore = Math.max(entry.bestScore, score);

        if (current.attempt_time > entry.latestAttemptTime) {
          entry.latestAttemptTime = current.attempt_time;
          entry.latestScore = score;
        }

        return accumulator;
      }, {}),
    ).sort((left, right) =>
      left.quizTitle.localeCompare(right.quizTitle, undefined, {
        sensitivity: "base",
      }),
    );

    const latestAttempt = filteredAttempts.reduce((latest, current) => {
      if (!latest) return current;
      return current.attempt_time > latest.attempt_time ? current : latest;
    });

    let latestAttemptReview: {
      quizId: string;
      quizTitle: string;
      attemptId: string;
      score: string;
      attemptTime: Date;
      incorrectAnswers: Array<{
        questionId: string;
        questionText: string;
        selectedOption: number;
        correctOption: number;
      }>;
    } | null = null;

    if (latestAttempt) {
      const responses = await database.query.quiz_response.findMany({
        where: and(
          eq(quiz_response.organization_id, organizationId),
          eq(quiz_response.quiz_attempt_id, latestAttempt.id),
        ),
        with: {
          question: true,
        },
      });

      latestAttemptReview = {
        quizId: latestAttempt.quiz_id,
        quizTitle: latestAttempt.quiz.title,
        attemptId: latestAttempt.id,
        score: latestAttempt.score,
        attemptTime: latestAttempt.attempt_time,
        incorrectAnswers: responses
          .filter(
            (response) =>
              response.selected_option !== response.question.correct_option,
          )
          .map((response) => ({
            questionId: response.question_id,
            questionText: response.question.text,
            selectedOption: response.selected_option,
            correctOption: response.question.correct_option,
          })),
      };
    }

    return {
      totalAttempts: filteredAttempts.length,
      byQuiz,
      latestAttemptReview,
    };
  },
});

