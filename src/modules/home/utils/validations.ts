import { z } from "zod";
import { MAX_INPUT_LENGTH } from "@/lib/constants";

export const problemSchema = z.object({
  problem: z
    .string()
    .min(10, "Please provide a bit more detail (min 10 characters).")
    .max(
      MAX_INPUT_LENGTH,
      `Problem description is too long.  Please limit to ${MAX_INPUT_LENGTH} characters for optimal visualization.`,
    )
    .refine((val) => val.trim().length > 0, "Problem cannot be just empty.")

    // Blocks only: Semicolons (;), Backslashes (\), and Quotes (' or ")
    .refine((val) => !/[;\\"']/.test(val), "Invalid problem description")

    .refine(
      (val) => !/\b(DROP TABLE|DELETE FROM|TRUNCATE|GRANT|REVOKE)\b/i.test(val),
      "Invalid problem description",
    ),
});
export type ProblemFormValues = z.infer<typeof problemSchema>;
