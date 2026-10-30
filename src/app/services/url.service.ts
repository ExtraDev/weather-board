import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { SettingsService } from './settings.service';

@Service()
export class UrlService {
    private readonly settingsService = inject(SettingsService);

    public getInfoUrl(): string {
        const deviceId = this.settingsService.getDeviceId() || '';
        return `${environment.apiURL}/weather/infos?device=${deviceId}`;
    }

    public getEvolutionsUrl(): string | undefined {
        const deviceId = this.settingsService.getDeviceId() || '';
        const variables = this.settingsService.getVariables();
        if (!variables) {
            return undefined;
        }

        return `${environment.apiURL}/weather/evolution?device=${deviceId}&variables=${variables}&period=day`;
    }
}
