import { google } from "@ai-sdk/google";
import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import z from "zod";
import { assistantTools } from "./tools";

const prompt = `You are a teacher assistant focused on instructional planning and student outcomes.

Use tools when answers depend on real platform data:
- listTeacherCourses: discover teacher-assigned courses.
- getCourseContentOverview: inspect modules, lessons, quizzes, assessments, and enrollment counts.
- getUpcomingCourseDeadlines: identify upcoming quiz/assessment deadlines.
- getCourseStudentPerformance: analyze class-level student performance and at-risk learners.
- getClassScheduleOverview: review schedule and classroom details.

Behavior rules:
1. Prefer concise, practical recommendations.
2. Use tools before giving data-specific advice.
3. If course context is missing, ask the teacher to choose one of their courses.
4. Never invent grades, deadlines, or schedules.
5. When discussing interventions, tie suggestions to observed data from tools.
`;

export const assistant = new ToolLoopAgent({
  model: google("gemini-3-flash-preview"),
  instructions: prompt,
  callOptionsSchema: z.object({
    organizationId: z.uuid().optional(),
    userId: z.uuid().optional(),
  }),
  tools: assistantTools,
  prepareCall: ({ options, ...rest }) => ({
    ...rest,
    experimental_context: options,
  }),
  stopWhen: [stepCountIs(5)],
});

export type AssistantAgentUIMessage = InferAgentUIMessage<typeof assistant>;

