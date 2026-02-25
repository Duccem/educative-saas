import { admin } from "@/lib/agents/admin";
import { assistant } from "@/lib/agents/assistant";
import { tutor } from "@/lib/agents/tutor";
import { auth } from "@/lib/auth/auth-server";
import { getSession } from "@/lib/auth/get-session";
import { createAgentUIStreamResponse } from "ai";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type AgentRole = "tutor" | "assistant" | "admin";

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

  const onFinish = async ({ messages }: { messages: unknown[] }) => {
    console.log("Final messages:", messages);
    console.log("Chat ID:", chat_id);
  };

  const onError = (error: unknown) => {
    console.error("Error:", error);
    return "An error occurred while processing your request. Please try again later.";
  };

  const options = {
    userId: session.user.id,
    organizationId: organization.id,
  };

  if (role === "tutor") {
    return createAgentUIStreamResponse({
      agent: tutor,
      uiMessages: messages,
      options,
      onFinish,
      onError,
    });
  }

  if (role === "assistant") {
    return createAgentUIStreamResponse({
      agent: assistant,
      uiMessages: messages,
      options,
      onFinish,
      onError,
    });
  }

  if (role === "admin") {
    return createAgentUIStreamResponse({
      agent: admin,
      uiMessages: messages,
      options,
      onFinish,
      onError,
    });
  }

  return NextResponse.json({ error: "Invalid role" }, { status: 400 });
};

