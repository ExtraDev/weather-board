import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { environment } from '../../environments/environment';

@Service()
export class WeatherService {
    protected readonly weatherResource = httpResource(() => ({
        url: `${environment.apiURL}?variables=101,201&period=day`,
        method: 'GET'
    }));

    protected readonly weatherValue = this.weatherResource.value();
}
