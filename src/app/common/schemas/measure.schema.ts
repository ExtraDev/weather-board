import z from "zod";
import { nullableToOptional } from "./helper";

export const MeasureSchema = z.object({
    min: nullableToOptional(z.number()),
    max: nullableToOptional(z.number()),
    total: nullableToOptional(z.number()),
    timestamp: z.number()
});
export type Measure = z.infer<typeof MeasureSchema>;