import { Component, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface Metrics {
    temp: boolean;
    hum: boolean;
    hpa: boolean;
    wind_speed: boolean;
    rain_: boolean;
    rain: boolean;
}

export interface SettingsDialogData {
    metrics: Metrics;
    deviceId: string;
}

@Component({
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatSlideToggleModule,
        MatInputModule,
        MatFormFieldModule,
        FormField
    ],
    selector: 'app-settings-dialog',
    styleUrl: './settings-dialog.scss',
    templateUrl: './settings-dialog.html',
})
export class SettingsDialog {
    readonly dialogRef = inject(MatDialogRef<SettingsDialog>);
    readonly data = inject<SettingsDialogData>(MAT_DIALOG_DATA);

    protected settingsModel = signal<SettingsDialogData>({
        metrics: {
            temp: this.data.metrics.temp,
            hum: this.data.metrics.hum,
            hpa: this.data.metrics.hpa,
            wind_speed: this.data.metrics.wind_speed,
            rain_: this.data.metrics.rain_,
            rain: this.data.metrics.rain,
        },
        deviceId: this.data.deviceId
    });

    protected settingsForm = form(this.settingsModel);

    protected onNoClick(): void {
        this.dialogRef.close();
    }
}
