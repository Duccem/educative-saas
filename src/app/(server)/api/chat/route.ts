import { admin } from "@/lib/agents/admin";
import { assistant } from "@/lib/agents/assistant";
import { tutor } from "@/lib/agents/tutor";
import { auth } from "@/lib/auth/auth-server";
import { getSession } from "@/lib/auth/get-session";
import { createAgentUIStreamResponse, ToolLoopAgent } from "ai";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const agents = {
  tutor,
  assistant,
  admin,
} as const;

type AgentRole = keyof typeof agents;

export const POST = async (req: NextRequest) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
    query: {
      membersLimit: 0,
    },
  });

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, chat_id, role } = await req.json();

  return createAgentUIStreamResponse({
    agent: agents[role as AgentRole],
    uiMessages: messages,
    onFinish: async ({ messages }) => {
      console.log("Final messages:", messages);
      console.log("Chat ID:", chat_id);
    },
    onError: (error) => {
      console.error("Error:", error);
      return "An error occurred while processing your request. Please try again later.";
    },
  });
};

