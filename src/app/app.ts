import { httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialog
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../environments/environment';
import { DeviceValues, DeviceValuesSchema } from './common/schemas/device.schema';
import { Evolutions, EvolutionsSchema } from './common/schemas/evolution.schema';
import { GraphComponent } from './components/graph/graph.component';
import { SettingsDialog } from './components/settings-dialog/settings-dialog';

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
    protected deviceId = signal<number | undefined>(undefined);
    protected evolutionsValues = signal<Evolutions | undefined>(undefined);
    protected deviceValues = signal<DeviceValues | undefined>(undefined);

    private dialog = inject(MatDialog);

    private evolutionUrl = `${environment.apiURL}/weather/evolution?device=1635490010&variables=101,801,201,541&period=day`;
    private currentInfos = `${environment.apiURL}/weather/infos?device=1635490010`;

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

    protected openSettings(): void {
        const dialogRef = this.dialog.open(SettingsDialog, {
            width: '95vw',
            maxWidth: '644px',
            // height: '95vh',
            // data: task
        });
    }

    private reloadWeatherInfos(): void {
        this.weatherInfos.reload();
    }

    private reloadWeatherEvolutions(): void {
        this.weatherInfos.reload();
    }
}