<template>
  <q-page>
    <main class="page_container">
      <div class="title_area">
        <h1>Main Dashboard</h1>
      </div>
      <div class="contents_wrapper">
        <div class="chart_area">
          <div ref="barChart" :style="chartSize" />
        </div>
      </div>
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
// import { storeToRefs } from 'pinia';

const userStore = useUserStore();
// const {  } = storeToRefs(userStore);

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
  height: '500px',
};

let chart: echarts.ECharts;

const drawChart = () => {
  if (!barChart.value) return;
  chart = echarts.init(barChart.value);

  const years = Object.keys(userStore.movieCountsByYear);
  const values = Object.values(userStore.movieCountsByYear);

  chart.setOption({
    title: { text: '연도별 영화 개봉 수' },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value' },
    series: [
      {
        data: values,
        type: 'bar',
        itemStyle: { color: '#42A5F5' },
      },
    ],
  });
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
