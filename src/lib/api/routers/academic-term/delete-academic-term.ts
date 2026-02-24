import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { academic_term } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteAcademicTerm = protectedProcedure
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

    const canDeleteAcademicTerm = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          academic_term: ["delete"],
        },
      },
    });

    if (!canDeleteAcademicTerm.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete an academic term",
      });
    }

    const existingAcademicTerm = await database.query.academic_term.findFirst({
      where: and(
        eq(academic_term.id, id),
        eq(academic_term.organization_id, organization.id),
      ),
    });

    if (!existingAcademicTerm) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Academic term not found",
      });
    }

    await database.delete(academic_term).where(eq(academic_term.id, id));

    return {
      success: true,
    };
  });

