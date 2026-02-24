import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { subject } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteSubject = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;
    const { organization } = context;

    const canDeleteSubject = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          subject: ["delete"],
        },
      },
    });

    if (!canDeleteSubject.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a subject",
      });
    }

    const existingSubject = await database.query.subject.findFirst({
      where: and(
        eq(subject.id, id),
        eq(subject.organization_id, organization.id),
      ),
    });

    if (!existingSubject) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Subject not found",
      });
    }

    await database.delete(subject).where(eq(subject.id, id));

    return {
      success: true,
    };
  });
