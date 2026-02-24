import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { academic_term } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateAcademicTermInputSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    is_active: z.boolean().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateAcademicTerm = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateAcademicTermInputSchema)
  .handler(async ({ input: { body, params } }) => {
    const { id } = params;
    const existingAcademicTerm = await database.query.academic_term.findFirst({
      where: eq(academic_term.id, id),
    });

    if (!existingAcademicTerm) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Academic term not found",
      });
    }

    const canUpdateAcademicTerm = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          academic_term: ["update"],
        },
      },
    });

    if (!canUpdateAcademicTerm.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update an academic term",
      });
    }

    await database
      .update(academic_term)
      .set({
        name: body.name ?? existingAcademicTerm.name,
        start_date: body.start_date ?? existingAcademicTerm.start_date,
        end_date: body.end_date ?? existingAcademicTerm.end_date,
        is_active: body.is_active ?? existingAcademicTerm.is_active,
      })
      .where(eq(academic_term.id, id));

    return {
      success: true,
    };
  });

