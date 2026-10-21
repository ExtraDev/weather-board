import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import z from 'zod';
import { GraphComponent } from './components/graph/graph.component';

const MeasureSchema = z.object({
    min: z.number(),
    max: z.number(),
    date: z.coerce.date()
});
export type Measure = z.infer<typeof MeasureSchema>;

const EvolutionSchema = z.object({
    name: z.string(),
    min: z.number(),
    max: z.number(),
    measures: z.array(MeasureSchema)
});
export type Evolution = z.infer<typeof EvolutionSchema>;

const EvolutionsSchema = z.array(EvolutionSchema);
export type WeatherEvolutions = z.infer<typeof EvolutionsSchema>;

@Component({
    selector: 'app-root',
    imports: [
        JsonPipe,
        GraphComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private url = `http://localhost:8080/weather/infos?device=1635490010`;

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
