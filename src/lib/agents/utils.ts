import z from "zod";

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

