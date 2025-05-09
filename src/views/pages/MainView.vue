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
          <p class="main__chart__title">월별 개봉 영화(2025)</p>
          <LineChartComp
            :size="chartSize"
            :x-axis="monthlyXaxis"
            :series="monthlySeries"
            :legend="monthlyLegend"
            :tooltip="barTooltip"
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
import LineChartComp from './components/LineChartComp.vue';

const movieStore = useMovieStore();
const { trandMvList, monthlyMovieCount, monthlyTVCount } = storeToRefs(movieStore);

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
  const movieList = monthlyMovieCount.value ?? [];
  const tvList = monthlyTVCount?.value ?? [];
  return [
    {
      name: 'Movies',
      data: movieList,
      type: 'line',
    },
    {
      name: 'TV Serises',
      data: tvList,
      type: 'line',
    },
  ];
});
const monthlyLegend = computed(() => {
  return {
    show: true,
    data: ['Movies', 'TV Serises'],
    textStyle: {
      color: '#fff', // Ensure text is visible
      fontSize: 12,
    },
  };
});
const movieSeries = computed(() => {
  const movieList = trandMvList.value ?? [];
  const top3Indices = movieList
    .filter((value, index) => index < 10)
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value.popularity - a.value.popularity)
    .slice(0, 3)
    .map((item) => item.index);

  return [
    {
      data: movieList.map((value, index) => {
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

const getMovieList = async () => {
  progressConfig.show();
  try {
    await movieStore.fetchMonthlyTvCounts(2025);
    await movieStore.fetchMonthlyMovieCounts(2025);
    await movieStore.searchTrandMovieByDay();
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
