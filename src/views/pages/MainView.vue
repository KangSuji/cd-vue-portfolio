<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <q-page>
    <main class="page_container main-container">
      <!-- <div class="main-card-wrapper">
        <mainCardComp icon="movie" :content="contents" />
        <mainCardComp icon="movie" :content="contents" />
        <mainCardComp icon="movie" :content="contents" />
        <mainCardComp icon="movie" :content="contents" />
      </div> -->

      <div class="main-chart-wrapper">
        <div class="main__chart">
          <p class="main__chart__title">영화 장르별 개수</p>
          <PieChartComp
            :size="chartSize"
            :series="moviePieChartSeries"
            :legend="moivePieLegend"
            :tooltip="pieToolTip"
          />
        </div>
        <div class="main__chart">
          <p class="main__chart__title">Get the trending movies 10(Today)</p>
          <BarChartComp
            :size="chartSize"
            :x-axis="movieXaxis"
            :series="movieSeries"
            :tooltip="barTooltip"
          />
        </div>
      </div>
      <div class="main-chart-wrapper">
        <div class="main__chart">
          <p class="main__chart__title">월별 개봉 영화(2025)</p>
          <LineChartComp
            :size="chartSize"
            :x-axis="monthlyXaxis"
            :series="monthlySeries"
            :tooltip="barTooltip"
          />
        </div>
        <div class="main__chart">
          <p class="main__chart__title">월별 평점 분포도(2025)</p>
          <HeatmapChartComp
            :size="chartSize"
            :x-axis="ratingXaxis"
            :y-axis="ratingYaxis"
            :series="ratingSeries"
            :visual-map="visualMap"
          />
        </div>
      </div>
    </main>
  </q-page>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '@/stores/useMainStore';
import progressConfig from '@/config/progressConfig';
import mainCardComp, { type Contents } from './components/mainCardComp.vue';
import BarChartComp from './components/BarChartComp.vue';
import PieChartComp from './components/PieChartComp.vue';
import LineChartComp from './components/LineChartComp.vue';
import HeatmapChartComp from './components/HeatmapChartComp.vue';

const movieStore = useMovieStore();
const { trandMvList, countMoviesGenres, monthlyMovieCount, heatmapData } = storeToRefs(movieStore);

const chartSize = {
  widht: '100%',
  height: '650px',
};

const monthlyXaxis = computed(() => {
  return [
    {
      type: 'category',
      data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    },
  ];
});

const monthlySeries = computed(() => {
  const list = monthlyMovieCount.value ?? [];
  return [
    {
      data: list,
      type: 'line',
    },
  ];
});

const ratingXaxis = computed(() => {
  return [
    {
      type: 'category',
      data: [
        '0 ~ 1',
        '1 ~ 2',
        '2 ~ 3',
        '3 ~ 4',
        '4 ~ 5',
        '5 ~ 6',
        '6 ~ 7',
        '7 ~ 8',
        '8 ~ 9',
        '9 ~ 10',
      ],
      splitArea: { show: true },
    },
  ];
});

const ratingYaxis = computed(() => {
  return [
    {
      type: 'category',
      data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      splitArea: { show: true },
    },
  ];
});

const visualMap = computed(() => {
  return {
    min: 0,
    max: 20, // 상황에 맞게 조정
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '5%',
  };
});

const ratingSeries = computed(() => {
  return [
    {
      name: '평점 분포',
      type: 'heatmap',
      data: heatmapData.value,
      label: { show: true },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
      },
    },
  ];
});

const movieSeries = computed(() => {
  const list = trandMvList.value ?? [];

  const top3Indices = list
    .filter((value, index) => index < 10)
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value.popularity - a.value.popularity)
    .slice(0, 3)
    .map((item) => item.index);

  return [
    {
      data: list.map((value, index) => {
        const isTop3 = top3Indices.includes(index);
        return {
          value: value.popularity,
          itemStyle: {
            color: isTop3 ? '#8884D8' : '#c8c8c8',
          },
          emphasis: {
            itemStyle: {
              color: '#8884D8',
            },
          },
        };
      }),
      type: 'bar',
      barStyle: {
        max: 120,
      },
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: '#8884D8',
      },
    },
  ];
});

const movieXaxis = computed(() => {
  const list = trandMvList.value ?? [];
  return [
    { type: 'category', data: list?.filter((item, idx) => idx < 10).map((item) => item.title) },
  ];
});

const barTooltip = computed(() => {
  {
    return {
      trigger: 'item',
      borderWidth: 0,
      padding: 0,
      backgroundColor: 'transparent',
      formatter: (params) => {
        return `
              <div class="tooltip_style">
                <p class="name">${params.name}</p>
                <p class="data">${params.value}</p>
              </div>
            `;
      },
      position: function (point, params, dom, rect, size) {
        return [point[0] + 20, point[1] - 30];
      },
    };
  }
});

// card
const contents = ref<Contents>({
  conent: '12345',
  discription: '영화 정보',
  icon: 'movie',
  increase: '+ 1%',
});

const moviePieChartSeries = computed(() => {
  const list = countMoviesGenres.value ?? {};
  const pieData = Object.entries(list).map(([name, value]) => ({
    name,
    value,
  }));

  return [
    {
      type: 'pie',
      radius: '60%',

      label: {
        show: true,
      },
      emphasis: {
        label: {
          show: true,
        },
      },
      labelLine: {
        show: true,
      },
      data: pieData,
    },
  ];
});

const moivePieLegend = computed(() => {
  const list = countMoviesGenres.value ?? {};
  const pieData = Object.entries(list).map(([name, value]) => ({
    name,
    value,
  }));
  return {
    orient: 'vertical',
    left: 'left',
    top: '10%',
    bottom: '10%',
    type: 'scroll',
    textStyle: {
      color: 'gray',
    },
    formatter: (name: string) => {
      const item = pieData.find((i) => i.name === name);
      return item ? `${item.name}: ${item.value}개` : name;
    },
  };
});

// 파이(도넛) 툴팁 커스텀
const pieToolTip = computed(() => {
  return {
    trigger: 'item',
    backgroundColor: 'transparent',
    borderWidth: 0,
    extraCssText: 'box-shadow: unset;',
    formatter: (params) => {
      return `
      <div class="pie-tooltip-style">
        <p class="title">${params.name}</p>
        <div class="content">
          <p class="marker">${params.marker}</p>
          <p class="content">${Number(params.percent).toFixed(1)}%</p>
        </div>
      </div>
      `;
    },
    position: function (point, params, dom, rect, size) {
      return [point[0] - 10, point[1] - 70]; // 툴팁 위치를 마우스 위로 조정
    },
  };
});

const getMovieList = async () => {
  progressConfig.show();
  try {
    await movieStore.getGenreMovieCounts();
    await movieStore.searchTrandMovieByDay();
    await movieStore.fetchMonthlyMovieCounts(2025);
    await movieStore.fetchHeatmapData();
  } catch (error) {
    console.error(error);
  } finally {
    progressConfig.hide();
  }
};

onMounted(() => {
  getMovieList();
});

onBeforeMount(() => movieStore.$reset());
</script>
