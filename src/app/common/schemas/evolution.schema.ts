import z from "zod";
import { nullableToOptional } from "./helper";
import { MeasureSchema } from "./measure.schema";

export const evolutionVariables = new Map<number, string>([
    [101, 'temperature'],
    [201, 'humidity'],
    [701, 'hPa'],
    [541, 'wind_speed'],
    [801, 'rain_'],
    [901, 'rain'],
]);

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