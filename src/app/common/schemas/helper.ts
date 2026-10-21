import z from "zod";

export const nullableToOptional = <T extends z.ZodTypeAny>(schema: T) =>
    schema
        .nullable()
        .optional()
        .transform(v => v ?? undefined);