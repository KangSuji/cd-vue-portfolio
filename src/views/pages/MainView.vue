<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <q-page>
    <main class="page_container main_container">
      <div class="title_area">
        <p class="title">
          <span class="material-symbols-rounded icon"> insert_chart </span>
          <span>Main Dashboard</span>
        </p>
      </div>
      <q-tabs v-model="tabs">
        <q-tab name="movie">Movies</q-tab>
        <q-tab name="series">series</q-tab>
      </q-tabs>
      <q-tab-panels v-model="tabs" keep-alive>
        <q-tab-panel name="movie">
          <div class="contents_wrapper">
            <p>Movie count(2020 - 2025)</p>
            <div class="chart_area">
              <div ref="barChart" :style="chartSize" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </main>
  </q-page>
</template>
<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { useUserStore } from '@/stores/useMainStore';
import { theme } from '@/config/chartOptions';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { movieCountsByYear } = storeToRefs(userStore);

const tabs = ref('movie');

// Echart 등록
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const barChart = ref();

const chartSize = {
  widht: '100%',
  height: '650px',
};

let chart: echarts.ECharts;

const drawChart = () => {
  if (!barChart.value) return;
  echarts.registerTheme('theme', theme.theme);
  chart = echarts.init(barChart.value, 'theme');

  const years = Object.keys(movieCountsByYear.value);
  const values = Object.values(movieCountsByYear.value);
  // console.log('values', values);

  const chartOptions = {
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value' },
    series: [
      {
        data: values,
        type: 'bar',
        barWidth: 120,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      borderWidth: 0,
      padding: 0,
      backgroundColor: 'transparent',
      formatter: (params) => {
        return `
        <div class="tooltip_style">
          <p class="name">${params.name}년</p>
          <p class="data">${params.data}개</p>
        </div>
      `;
      },
      position: function (point, params, dom, rect, size) {
        return [point[0] + 20, point[1] - 30];
      },
    },
    legend: {
      type: 'scroll',
    },
    grid: {
      containLabel: true,
    },
  };
  chart.setOption({ ...chartOptions }, true);
};

const resizeChart = () => {
  chart.resize();
};

const getMovieList = async () => {
  try {
    await useUserStore().fetchMoviesCount(2025);
  } catch (error) {
    console.error(error);
  } finally {
    drawChart();
  }
};
onMounted(() => {
  getMovieList();
  window.addEventListener('resize', resizeChart);
});

onBeforeMount(() => window.removeEventListener('resize', resizeChart));
</script>
