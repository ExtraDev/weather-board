import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { EChartsCoreOption } from 'echarts';
import { LineChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Evolution } from '../../app';

echarts.use([
    GridComponent,
    LegendComponent,
    TooltipComponent,
    DataZoomComponent,
    LineChart,
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

    protected chart = computed(() => {
        const chart: EChartsCoreOption = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'mousemove|click',
                formatter: (params: any) => {
                    const items = Array.isArray(params) ? params : [params];
                    const hour = items[0]?.axisValueLabel ?? '';

                    return [
                        `${hour} heure`,
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
                data: this.evolution()?.measures.map(measure => new Date(measure.timestamp).getHours()),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: 'min',
                    data: this.evolution()?.measures.map(measure => measure.min),
                    type: 'line',
                    smooth: true,
                },
                {
                    name: 'max',
                    data: this.evolution()?.measures.map(measure => measure.max),
                    type: 'line',
                    smooth: true,
                },
                {
                    name: 'moy,',
                    data: this.evolution()?.measures.map(measure => ((measure.min || 0 + (measure.max || 0)) / 2).toFixed(1)),
                    type: 'line',
                    smooth: true,
                },
            ],
            dataZoom: [
                { type: 'inside' },
                { type: 'slider' }
            ]
        }

        return chart;
    })
}
