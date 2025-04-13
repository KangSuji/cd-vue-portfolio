<template>
  <q-page>
    <main class="main_container">
      <div class="title_area">
        <h1>Main Dashboard</h1>
      </div>
      <div class="contents_wrapper">
        <div class="chart_area">
          <div ref="lineChart" :style="chartSize" />
        </div>
      </div>
    </main>
  </q-page>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';

// Echart 등록
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

const lineChart = ref();
const chartSize = {
  widht: '100%',
  height: '500px',
};
const chartDatas = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
};

let chart: echarts.ECharts;

const drawChart = () => {
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(lineChart.value);
  chart.setOption({ ...chartDatas }, true);
};

onMounted(() => {
  nextTick(() => {
    drawChart();
  });
});
</script>
