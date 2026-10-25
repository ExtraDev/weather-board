import { Component, inject } from '@angular/core';
import {
    MatDialogRef
} from '@angular/material/dialog';

@Component({
    imports: [],
    selector: 'app-settings-dialog',
    styleUrl: './settings-dialog.scss',
    templateUrl: './settings-dialog.html',
})
export class SettingsDialog {
    readonly dialogRef = inject(MatDialogRef<SettingsDialog>);
}
