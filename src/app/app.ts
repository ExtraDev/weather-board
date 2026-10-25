import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeviceValues, DeviceValuesSchema } from './common/schemas/device.schema';
import { Evolutions, EvolutionsSchema } from './common/schemas/evolution.schema';
import { GraphComponent } from './components/graph/graph.component';

@Component({
    selector: 'app-root',
    imports: [
        MatProgressSpinnerModule,
        MatButtonModule,
        GraphComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected evolutionsValues = signal<Evolutions | undefined>(undefined);
    protected deviceValues = signal<DeviceValues | undefined>(undefined);

    private evolutionUrl = `http://localhost:8080/weather/evolution?device=1635490010&variables=101,801,201,541&period=day`;
    private currentInfos = `http://localhost:8080/weather/infos?device=1635490010`;

    public constructor() {
        const intervalWeatherInfos = setInterval(this.reloadWeatherInfos, 1000 * 60 * 5);
        const intervalWeatherEvolutions = setInterval(this.reloadWeatherEvolutions, 1000 * 60 * 15);
    }

    protected readonly weatherInfos = httpResource(
        () => this.currentInfos, //'/services/mocks101day.json'
        {
            parse: (raw) => {
                const parsed = DeviceValuesSchema.safeParse(raw);
                if (!parsed.success) {
                    console.error(parsed.error);
                    throw parsed.error;
                }

                this.deviceValues.set(parsed.data);

                return parsed.data;
            }
        });

    protected readonly weatherEvolutions = httpResource(
        () => this.evolutionUrl, //'/services/mocks101day.json'
        {
            parse: (raw) => {
                const parsed = EvolutionsSchema.safeParse(raw);
                if (!parsed.success) {
                    console.error(parsed.error);
                    throw parsed.error;
                }

                this.evolutionsValues.set(parsed.data);

                return parsed.data;
            }
        });

    private reloadWeatherInfos(): void {
        this.weatherInfos.reload();
    }

    private reloadWeatherEvolutions(): void {
        this.weatherInfos.reload();
    }
}