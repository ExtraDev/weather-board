import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';

@Service()
export class WeatherService {
    protected readonly weatherResource = httpResource(() => ({
        url: 'http://localhost:8080?variables=101,201&period=day',
        method: 'GET'
    }));

    protected readonly weatherValue = this.weatherResource.value();
}
