import z from "zod";
import { nullableToOptional } from "./helper";
import { MeasureSchema } from "./measure.schema";

export const EvolutionSchema = z.object({
    name: z.string(),
    min: nullableToOptional(z.number()),
    max: nullableToOptional(z.number()),
    total: nullableToOptional(z.number()),
    measures: z.array(MeasureSchema)
});
export type Evolution = z.infer<typeof EvolutionSchema>;

export const EvolutionsSchema = z.array(EvolutionSchema);
export type Evolutions = z.infer<typeof EvolutionsSchema>;