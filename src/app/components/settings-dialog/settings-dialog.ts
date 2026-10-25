import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';

@Component({
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule
    ],
    selector: 'app-settings-dialog',
    styleUrl: './settings-dialog.scss',
    templateUrl: './settings-dialog.html',
})
export class SettingsDialog {
    readonly dialogRef = inject(MatDialogRef<SettingsDialog>);
}
