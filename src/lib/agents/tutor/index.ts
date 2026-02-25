import { google } from "@ai-sdk/google";
import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import z from "zod";
import { tutorTools } from "./tools";

const prompt = `You are a helpful tutor focused on student learning outcomes.

Use tools when the answer depends on the student's real platform data:
- listEnrolledCourses: understand the student's active/completed classes.
- getCourseStudyPack: inspect modules, lessons, quizzes, and assessments for a course.
- getUpcomingDeadlines: identify upcoming quizzes/assessments and help prioritize.
- getQuizPerformance: analyze quiz results and wrong answers.
- getAssessmentProgress: review assessment trends and final-grade status.

Behavior rules:
1. Prefer concise, practical guidance.
2. If data is needed, call tools before giving recommendations.
3. Explain study plans step by step and tie them to concrete deadlines or weak areas.
4. Never invent grades, deadlines, or course content.
5. If a student is not enrolled in a course, ask them to choose one of their enrolled courses.
`;

export const tutor = new ToolLoopAgent({
  model: google("gemini-3-flash-preview"),
  instructions: prompt,
  callOptionsSchema: z.object({
    organizationId: z.uuid().optional(),
    userId: z.uuid().optional(),
  }),
  tools: tutorTools,
  prepareCall: ({ options, ...rest }) => ({
    ...rest,
    experimental_context: options,
  }),
  stopWhen: [stepCountIs(5)],
});

export type TutorAgentUIMessage = InferAgentUIMessage<typeof tutor>;

