import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

const gradeInputSchema = z.object({
  name: z.string().min(1),
  level: z.coerce.number().int().optional(),
  description: z.string().optional(),
});

export const addGrade = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: gradeInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          grade: ["create"],
        },
      },
    });

    if (!canAddGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a grade",
      });
    }

    await database.insert(grade).values({
      name: body.name,
      level: body.level,
      description: body.description,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

