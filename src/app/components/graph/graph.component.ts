import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { EChartsCoreOption } from 'echarts';
import { BarChart, LineChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Evolution } from '../../common/schemas/evolution.schema';
import { Period } from '../settings-dialog/settings-dialog';

echarts.use([
    GridComponent,
    LegendComponent,
    TooltipComponent,
    DataZoomComponent,
    LineChart,
    BarChart,
    CanvasRenderer
]);

@Component({
    imports: [
        NgxEchartsDirective
    ],
    selector: 'app-graph',
    styleUrl: './graph.component.scss',
    templateUrl: './graph.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class GraphComponent {
    public evolution = input<Evolution>();
    public period = input<Period>();

    protected chart = computed(() => {
        let series: Array<unknown>;

        if (this.evolution()?.name === 'rain_') {
            series = [
                {
                    name: 'mm',
                    data: this.evolution()?.measures.map(measure => measure.total),
                    type: 'bar',
                    smooth: true,
                }
            ]
        } else {
            series = [
                {
                    name: 'max',
                    data: this.evolution()?.measures.map(measure => measure.max),
                    type: 'line',
                    smooth: true,
                }, {
                    name: 'min',
                    data: this.evolution()?.measures.map(measure => measure.min),
                    type: 'line',
                    smooth: true,
                }
            ]
        }

        const chart: EChartsCoreOption = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'mousemove|click',
                formatter: (params: any) => {
                    const items = Array.isArray(params) ? params : [params];
                    const timeLabel = items[0]?.axisValueLabel ?? '';
                    const title = this.period() === 'day'
                        ? `À ${timeLabel}`
                        : `Le ${timeLabel}`;

                    return [
                        title,
                        ...items.map(item => `${item.marker}${item.seriesName}: ${item.value}`)
                    ].join('<br/>');
                }
            },
            legend: {
                top: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.evolution()?.measures.map(measure => this.formatTime(measure.timestamp)),
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
            },
            series: series,
            dataZoom: [
                { type: 'inside', zoomOnMouseWheel: false },
                { type: 'slider' }
            ]
        }

        return chart;
    });

    protected translateTitle(title: string): string {
        let translation = '';

        if (title === 'temperature') {
            translation = 'Température';
        } else if (title === 'humidity') {
            translation = 'Humidité';
        } else if (title === 'hPa') {
            translation = 'Pression atmosphérique';
        } else if (title === 'wind_speed') {
            translation = 'Vitesse du vent';
        } else if (title === 'rain_') {
            translation = 'Pluie';
        } else {
            translation = title;
        }

        return translation;
    }

    private formatTime(timestamp: number): string {
        let formatted = '';
        const timestampDate = new Date(timestamp * 1000);

        if (this.period() === 'day') {
            formatted += timestampDate.getHours() + 'h';
        } else if (this.period() === 'week') {
            formatted += timestampDate.getDate() + '.' + (timestampDate.getMonth() + 1);
        } else if (this.period() === 'month') {
            formatted += timestampDate.getDate() + '.' + (timestampDate.getMonth() + 1) + '.' + timestampDate.getFullYear();
        }

        return formatted;
    }
}
