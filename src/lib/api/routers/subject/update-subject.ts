import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { subject } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateSubjectInputSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});
export const updateSubject = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateSubjectInputSchema)
  .handler(async ({ input: { body, params } }) => {
    const { id } = params;
    const existingSubject = await database.query.subject.findFirst({
      where: eq(subject.id, id),
    });

    if (!existingSubject) {
      return new ORPCError("NOT_FOUND", {
        cause: "Subject not found",
      });
    }

    const canAddSubject = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          subject: ["update"],
        },
      },
    });

    if (!canAddSubject.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a subject",
      });
    }

    await database
      .update(subject)
      .set({
        name: body.name ?? existingSubject.name,
        description: body.description ?? existingSubject.description,
      })
      .where(eq(subject.id, id));

    return {
      success: true,
    };
  });

