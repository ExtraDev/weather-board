import z from "zod";
import { nullableToOptional } from "./helper";

export const DeviceSchema = z.object({
    account: z.number(),
    status: z.string(),
    city: z.string(),
    image: nullableToOptional(z.string()),
    isWebcam: z.boolean(),
    favorite: z.boolean(),
    social: z.union([z.boolean(), z.string()]),
    altitude: z.string(),
    update: z.number(),
});
export type Device = z.infer<typeof DeviceSchema>;

export const InfoValuesSchema = z.object({
    temp: nullableToOptional(z.string()),
    hum: nullableToOptional(z.string()),
    dew: nullableToOptional(z.string()),
    wspdavg: nullableToOptional(z.string()),
    wdiravg: nullableToOptional(z.string()),
    bar: nullableToOptional(z.string()),
    rain: nullableToOptional(z.string()),
    rainrate: nullableToOptional(z.string()),
    solarrad: nullableToOptional(z.string()),
    uvi: nullableToOptional(z.string()),
});
export type InfoValues = z.infer<typeof InfoValuesSchema>;

export const DeviceValuesSchema = z.object({
    device: DeviceSchema,
    values: InfoValuesSchema,
});
export type DeviceValues = z.infer<typeof DeviceValuesSchema>;