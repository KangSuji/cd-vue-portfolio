<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <q-page>
    <main class="page_container main-container">
      <div class="main-card-wrapper">
        <mainCardComp icon="movie" :content="contents" />
        <mainCardComp icon="movie" :content="contents" />
        <mainCardComp icon="movie" :content="contents" />
        <mainCardComp icon="movie" :content="contents" />
      </div>

      <div class="main-chart-wrapper">
        <div class="main__chart">
          <PieChartComp :size="chartSize" :series="pieChartSeries" />
        </div>
        <div class="main__chart">
          <BarChartComp :size="chartSize" :x-axis="Xaxis" :y-axis="yAxis" :series="series" />
        </div>
      </div>
    </main>
  </q-page>
</template>
<script lang="ts" setup>
//TODO: 검색 할 년도 선택 받기, 영화와 티비 시리즈 토탈 개수만 얻을수 있는 API 찾아보기
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '@/stores/useMainStore';
import progressConfig from '@/config/progressConfig';
import mainCardComp, { type Contents } from './components/mainCardComp.vue';
import BarChartComp from './components/BarChartComp.vue';
import DateComp from '@/components/DateComp.vue';
import PieChartComp from './components/PieChartComp.vue';

const moiveStore = useMovieStore();
const { countsByYear } = storeToRefs(moiveStore);

const tabs = ref('movie');

const now = new Date();
const currentYear = now.getFullYear();
const startYear = ref(String(currentYear - 5));
const endYear = ref(String(currentYear));

const chartSize = {
  widht: '100%',
  height: '650px',
};

const series = computed(() => {
  const values = Object.values(countsByYear.value);
  return [
    {
      data: values,
      type: 'bar',
      barStyle: {
        max: 120,
      },
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
      },
    },
  ];
});

const Xaxis = computed(() => {
  const years = Object.keys(countsByYear.value);
  return [{ type: 'category', data: years }];
});

const yAxis = computed(() => [{ type: 'value' }]);

// card
const contents = ref<Contents>({
  conent: '12345',
  discription: '영화 정보',
  icon: 'movie',
  increase: '+ 1%',
});

const pieChartSeries = [
  {
    name: 'Access From',
    type: 'pie',
    radius: ['55%'],
    avoidLabelOverlap: false,
    label: {
      show: false,
      position: 'center',
    },
    emphasis: {
      label: {
        show: true,
        fontSize: '15',
        fontWeight: 'bold',
      },
    },
    labelLine: {
      show: false,
    },
    data: [
      { value: 1048, name: '액션' },
      { value: 735, name: '드라마' },
      { value: 580, name: 'SF' },
      { value: 484, name: '코미디' },
      { value: 300, name: '스릴러' },
    ],
  },
];

const getMovieList = async (tabName: string) => {
  progressConfig.show();
  try {
    const params = {
      type: tabName ?? 'movie',
      startYear: startYear.value,
      endYear: endYear.value,
    };
    await moiveStore.fetchCount(params);
  } catch (error) {
    console.error(error);
  } finally {
    progressConfig.hide();
  }
};

onMounted(() => {
  getMovieList(tabs.value);
});

onBeforeMount(() => moiveStore.$reset());
</script>
