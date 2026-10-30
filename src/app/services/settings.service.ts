import { Service, signal } from '@angular/core';

export interface SettingsStoreData {
    deviceId?: string;
    variables?: string;
}

@Service()
export class SettingsService {
    private readonly settings = signal<SettingsStoreData>({
        deviceId: localStorage.getItem('deviceId') || undefined,
        variables: localStorage.getItem('variables') || undefined
    });

    public getDeviceId(): string | undefined {
        return this.settings().deviceId;
    }

    public setDeviceId(deviceId: string): void {
        localStorage.setItem('deviceId', deviceId);
        this.settings.update(settings => ({ ...settings, deviceId }));
    }

    public getVariables(): string | undefined {
        return this.settings().variables;
    }

    public setVariables(variables: string): void {
        localStorage.setItem('variables', variables);
        this.settings.update(settings => ({ ...settings, variables }));
    }

    public getSettings(): SettingsStoreData {
        return this.settings();
    }

    public setSettings(settings: SettingsStoreData): void {
        if (settings.deviceId === undefined) {
            localStorage.removeItem('deviceId');
        } else {
            localStorage.setItem('deviceId', settings.deviceId);
        }

        if (settings.variables === undefined) {
            localStorage.removeItem('variables');
        } else {
            localStorage.setItem('variables', settings.variables);
        }

        this.settings.set(settings);
    }
}
