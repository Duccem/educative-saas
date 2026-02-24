import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { classroom } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

const classroomInputSchema = z.object({
  name: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
  is_virtual: z.boolean().optional(),
});

export const addClassroom = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: classroomInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddClassroom = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          classroom: ["create"],
        },
      },
    });

    if (!canAddClassroom.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a classroom",
      });
    }

    await database.insert(classroom).values({
      name: body.name,
      capacity: body.capacity,
      is_virtual: body.is_virtual ?? false,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

