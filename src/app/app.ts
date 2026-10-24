import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import z from 'zod';
import { nullableToOptional } from './common/schemas/helper';
import { GraphComponent } from './components/graph/graph.component';

const MeasureSchema = z.object({
    min: nullableToOptional(z.number()),
    max: nullableToOptional(z.number()),
    total: nullableToOptional(z.number()),
    timestamp: z.number()
});
export type Measure = z.infer<typeof MeasureSchema>;

const EvolutionSchema = z.object({
    name: z.string(),
    min: nullableToOptional(z.number()),
    max: nullableToOptional(z.number()),
    total: nullableToOptional(z.number()),
    measures: z.array(MeasureSchema)
});
export type Evolution = z.infer<typeof EvolutionSchema>;

const EvolutionsSchema = z.array(EvolutionSchema);
export type WeatherEvolutions = z.infer<typeof EvolutionsSchema>;

@Component({
    selector: 'app-root',
    imports: [
        GraphComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private url = `http://localhost:8080/weather/evolution?device=1635490010&variables=101,801,201,541&period=day`;

    public weatherEvolutions = signal<WeatherEvolutions>(new Array());

    protected readonly weatherResource = httpResource(
        () => this.url, //'/services/mocks101day.json'
        {
            parse: (raw) => {
                const parsed = EvolutionsSchema.safeParse(raw);
                if (!parsed.success) {
                    console.error(parsed.error);
                    throw parsed.error;
                }
                const evolutions = parsed.data;

                this.weatherEvolutions.set(evolutions);
                return parsed.data;
            }
        });

    protected evolutions = this.weatherResource.value();
}
