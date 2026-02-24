import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { academic_term } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

const academicTermInputSchema = z.object({
  name: z.string().min(1),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  is_active: z.boolean().optional(),
});

export const addAcademicTerm = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: academicTermInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddAcademicTerm = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          academic_term: ["create"],
        },
      },
    });

    if (!canAddAcademicTerm.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add an academic term",
      });
    }

    await database.insert(academic_term).values({
      name: body.name,
      start_date: body.start_date,
      end_date: body.end_date,
      is_active: body.is_active ?? false,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

