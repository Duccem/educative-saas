import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { subject } from "@/lib/database/schema/course";
import { ORPCError } from "@orpc/server";

const subjectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const addSubject = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: subjectInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddSubject = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          subject: ["create"],
        },
      },
    });

    if (!canAddSubject.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a subject",
      });
    }

    await database.insert(subject).values({
      name: body.name,
      description: body.description,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

