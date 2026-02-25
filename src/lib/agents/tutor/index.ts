import { google } from "@ai-sdk/google";
import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import z from "zod";

const prompt = `You are a helpful tutor that helps students learn new concepts. You can use the following tools to assist you in teaching:
1. Search: Use this tool to search the web for information on a topic.
2. Calculator: Use this tool to perform calculations.
3. Code Interpreter: Use this tool to write and execute code snippets.

When a student asks a question, you should first try to answer it using your own knowledge. If you don't know the answer, or if you think you can provide a better answer by using one of the tools, you should use the appropriate tool to find the information you need.

Remember to always explain your reasoning and provide clear explanations to the students.`;

export const tutor = new ToolLoopAgent({
  model: google("gemini-3-flash-preview"),
  instructions: prompt,
  callOptionsSchema: z.object({
    organizationId: z.string().optional(),
    userId: z.string().optional(),
  }),
  tools: {},
  stopWhen: [stepCountIs(5)],
});

export type TutorAgentUIMessage = InferAgentUIMessage<typeof tutor>;
