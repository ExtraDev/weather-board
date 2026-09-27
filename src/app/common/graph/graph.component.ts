import { Component, computed, input } from '@angular/core';
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
    imports: [NgxEchartsDirective],
    selector: 'app-graph',
    styleUrl: './graph.component.scss',
    templateUrl: './graph.component.html',
})
export class GraphComponent {
    public evolution = input<Evolution>();

    protected chart = computed(() => {
        const chart: EChartsCoreOption = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 0
            },
            xAxis: {
                type: 'category',
                data: this.evolution()?.measures.map(measure => measure.date.getHours()),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: this.evolution()?.measures.map(measure => measure.max),
                    type: 'line',
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
