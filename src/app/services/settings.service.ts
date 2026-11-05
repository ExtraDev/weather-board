import { Service, signal } from '@angular/core';
import type { Period } from '../components/settings-dialog/settings-dialog';

function isPeriod(value: string | null): value is Period {
    return value === 'day' || value === 'week' || value === 'month';
}

function getStoredPeriod(): Period | undefined {
    const value = localStorage.getItem('period');
    return isPeriod(value) ? value : undefined;
}

export interface SettingsStoreData {
    deviceId?: string;
    variables?: string;
    period?: Period;
}

@Service()
export class SettingsService {
    private readonly settings = signal<SettingsStoreData>({
        deviceId: localStorage.getItem('deviceId') || undefined,
        variables: localStorage.getItem('variables') || undefined,
        period: getStoredPeriod()
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

    public getPeriod(): Period {
        return this.settings().period || 'day';
    }

    public setPeriod(period: Period): void {
        localStorage.setItem('period', period);
        this.settings.update(settings => ({ ...settings, period }));
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

        if (settings.period === undefined) {
            localStorage.removeItem('period');
        } else {
            localStorage.setItem('period', settings.period);
        }

        this.settings.set(settings);
    }
}
