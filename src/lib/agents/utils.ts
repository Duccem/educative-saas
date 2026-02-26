import z from "zod";
import { database } from "../database";
import { chat } from "../database/schema/chat";
import { and, eq } from "drizzle-orm";

export const agentContextSchema = z.object({
  organizationId: z.uuid(),
  userId: z.uuid(),
});

export const getRequiredContext = (experimentalContext: unknown) => {
  const parsed = agentContextSchema.safeParse(experimentalContext);

  if (!parsed.success) {
    throw new Error(
      "Agent tool context is missing. Ensure userId and organizationId are passed in call options.",
    );
  }

  return parsed.data;
};

export const saveChat = async ({
  chatId,
  organizationId,
  userId,
  agentId,
  messages,
}: {
  chatId?: string;
  organizationId: string;
  userId: string;
  agentId: string;
  messages: any[];
}) => {
  const existingChat = await database.query.chat.findFirst({
    where: eq(chat.id, chatId ?? ""),
  });
  if (existingChat) {
    await database
      .update(chat)
      .set({ messages })
      .where(eq(chat.id, existingChat.id));
    return;
  } else {
    await database.insert(chat).values({
      organization_id: organizationId,
      user_id: userId,
      agent: agentId,
      messages,
      status: "active",
    });
  }
};

export const getChatOfUser = async ({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) => {
  const userChat = await database.query.chat.findFirst({
    where: and(
      eq(chat.organization_id, organizationId),
      eq(chat.user_id, userId),
      eq(chat.status, "active"),
    ),
  });

  return userChat;
};

export const closeChat = async ({
  chatId,
  organizationId,
  userId,
}: {
  chatId: string;
  organizationId: string;
  userId: string;
}) => {
  await database
    .update(chat)
    .set({ status: "closed" })
    .where(
      and(
        eq(chat.id, chatId),
        eq(chat.organization_id, organizationId),
        eq(chat.user_id, userId),
      ),
    );
};

