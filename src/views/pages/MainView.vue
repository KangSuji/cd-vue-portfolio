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
      <div class="main_tabs">
        <q-tabs v-model="tabs" dense class="main_tabs_wrapper">
          <q-tab name="movie">Movies</q-tab>
          <q-tab name="series">series</q-tab>
        </q-tabs>
      </div>
      <q-tab-panels v-model="tabs" keep-alive>
        <q-tab-panel name="movie">
          <div class="contents_wrapper">
            <div class="search_area">
              <DateComp :start-date="startYear" />
              <DateComp :is-start-date="false" :start-date="endYear" />
            </div>
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
//TODO: 검색 할 년도 선택 받기, 영화와 티비 시리즈 토탈 개수만 얻을수 있는 API 찾아보기
import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { useMovieStore } from '@/stores/useMainStore';
import { theme } from '@/config/chartOptions';
import { storeToRefs } from 'pinia';
import progressConfig from '@/config/progressConfig';
import DateComp from '@/components/DateComp.vue';

const moiveStore = useMovieStore();
const { movieCountsByYear } = storeToRefs(moiveStore);

const tabs = ref('movie');

const startYear = ref('');
const endYear = ref('');

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

const drawChart = async () => {
  if (!barChart.value) return;
  echarts.registerTheme('theme', theme.theme);
  chart = echarts.init(barChart.value, 'theme');

  const years = Object.keys(movieCountsByYear.value);
  const values = Object.values(movieCountsByYear.value);
  console.log('values', values);

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
  progressConfig.show();
  try {
    await moiveStore.fetchMoviesCount();
    await nextTick();
    await drawChart();
  } catch (error) {
    console.error(error);
  } finally {
    progressConfig.hide();
  }
};

onMounted(() => {
  getMovieList();
  window.addEventListener('resize', resizeChart);
});

onBeforeMount(() => window.removeEventListener('resize', resizeChart));
</script>
