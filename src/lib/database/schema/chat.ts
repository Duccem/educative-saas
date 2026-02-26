import { json, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization, user } from "./auth";

export const chat = pgTable("chat", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id),
  agent: text("agent").notNull(),
  messages: json("messages").notNull().default([]),
  status: text("status").notNull().default("active"),
});

