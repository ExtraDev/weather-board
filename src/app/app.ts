import { httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialog
} from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { DeviceValues, DeviceValuesSchema } from './common/schemas/device.schema';
import { Evolutions, EvolutionsSchema } from './common/schemas/evolution.schema';
import { GraphComponent } from './components/graph/graph.component';
import { SettingsDialog, SettingsDialogData } from './components/settings-dialog/settings-dialog';
import { WindDial } from './components/windial/windial';
import { SettingsService } from './services/settings.service';
import { UrlService } from './services/url.service';

@Component({
    selector: 'app-root',
    imports: [
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatButtonModule,
        GraphComponent,
        WindDial
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected evolutionsValues = signal<Evolutions | undefined>(undefined);
    protected deviceValues = signal<DeviceValues | undefined>(undefined);

    private dialog = inject(MatDialog);
    private urlService = inject(UrlService);
    private settingsService = inject(SettingsService);

    private _snackBar = inject(MatSnackBar);

    public constructor() {
        setInterval(() => {
            this.weatherInfosResource.reload();
        }, 1000 * 60 * 5);
        setInterval(() => {
            this.weatherEvolutionsResource.reload();
        }, 1000 * 60 * 15);

        if (!this.settingsService.getDeviceId()) {
            this.openSettings();
        }
    }

    protected readonly weatherInfosResource = httpResource(
        () => this.urlService.getInfoUrl(), //'/services/mocks101day.json'
        {
            parse: (raw) => {
                const parsed = DeviceValuesSchema.safeParse(raw);
                if (!parsed.success) {
                    console.error(parsed.error);
                    throw parsed.error;
                }

                const deviceValues = parsed.data;

                this.deviceValues.set(deviceValues);
                return deviceValues;
            }
        });

    protected readonly weatherEvolutionsResource = httpResource(
        () => this.urlService.getEvolutionsUrl(), //'/services/mocks101day.json'
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

    protected async openSettings(): Promise<void> {
        const settings = this.settingsService.getSettings();

        const settingsDialogData: SettingsDialogData = {
            metrics: {
                temp: settings.variables?.includes('101') || false,
                hum: settings.variables?.includes('201') || false,
                hpa: settings.variables?.includes('701') || false,
                wind_speed: settings.variables?.includes('541') || false,
                rain_: settings.variables?.includes('801') || false,
                rain: settings.variables?.includes('901') || false,
            },
            deviceId: settings.deviceId || '4633478916'
        };

        if (!settingsDialogData) {
            this._snackBar.open('Aucun paramètre possible');
            return;
        }

        const response = await firstValueFrom(
            this.dialog.open<SettingsDialog, SettingsDialogData, SettingsDialogData>(
                SettingsDialog,
                {
                    width: '95vw',
                    maxWidth: '644px',
                    data: settingsDialogData,
                    autoFocus: 'dialog'
                }
            ).afterClosed()
        );

        if (!response) return;
        let variables = '';
        if (response.metrics.temp) {
            variables += '101,';
        }
        if (response.metrics.hum) {
            variables += '201,';
        }
        if (response.metrics.hpa) {
            variables += '701,';
        }
        if (response.metrics.wind_speed) {
            variables += '541,';
        }
        if (response.metrics.rain_) {
            variables += '801,';
        }
        if (response.metrics.rain) {
            variables += '901,';
        }

        this.settingsService.setSettings({
            deviceId: response.deviceId,
            variables
        });
    }
}