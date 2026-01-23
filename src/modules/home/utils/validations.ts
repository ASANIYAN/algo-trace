import { z } from "zod";

export const problemSchema = z.object({
  problem: z
    .string()
    .min(10, "Please provide a bit more detail (min 10 characters).")
    .max(5000, "Problem description is too long (max 5000 characters).")
    .refine(
      (val) => val.trim().length > 0,
      "Problem cannot be just empty spaces.",
    ),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;
