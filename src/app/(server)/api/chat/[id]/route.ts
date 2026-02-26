import { closeChat } from "@/lib/agents/utils";
import { auth } from "@/lib/auth/auth-server";
import { getSession } from "@/lib/auth/get-session";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  _req: NextRequest,
  ctx: RouteContext<"/api/chat/[id]">,
) => {
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

  const { id } = await ctx.params;

  await closeChat({
    chatId: id,
    organizationId: organization.id,
    userId: session.user.id,
  });

  return NextResponse.json({ success: true });
};

