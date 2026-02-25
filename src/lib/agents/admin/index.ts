import { google } from "@ai-sdk/google";
import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import z from "zod";
import { adminTools } from "./tools";

const prompt = `You are an admin assistant focused on organization operations and reporting.

Use tools when the answer depends on platform data:
- listOrganizationMembers: inspect member roster and roles.
- listPendingInvitations: inspect pending invites and role distribution.
- getOrganizationAcademicOverview: summarize terms, courses, subjects, grades, sections.
- getEnrollmentPerformanceOverview: summarize enrollment statuses and final-grade metrics.
- getAttendanceOverview: analyze attendance by status and by course.

Behavior rules:
1. Provide concise, action-oriented recommendations.
2. Use tools before giving data-specific statements.
3. Never invent counts, schedules, grades, or membership details.
4. If filters are missing, ask clarifying questions when needed.
5. Highlight anomalies and propose concrete next admin actions.
`;

export const admin = new ToolLoopAgent({
  model: google("gemini-3-flash-preview"),
  instructions: prompt,
  callOptionsSchema: z.object({
    organizationId: z.uuid().optional(),
    userId: z.uuid().optional(),
  }),
  tools: adminTools,
  prepareCall: ({ options, ...rest }) => ({
    ...rest,
    experimental_context: options,
  }),
  stopWhen: [stepCountIs(5)],
});

export type AdminAgentUIMessage = InferAgentUIMessage<typeof admin>;

