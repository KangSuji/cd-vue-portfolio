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
      <div class="main_top">
        <div class="search_container">
          <p class="area_title">{{ `Movie count(${startYear} - ${endYear})` }}</p>
          <div class="search_area">
            <DateComp
              :is-start-year="true"
              :start-year="startYear"
              :end-year="endYear"
              @update-date="(val) => (startYear = val)"
            />
            <DateComp
              :is-start-year="false"
              :start-year="startYear"
              :end-year="endYear"
              @update-date="(val) => (endYear = val)"
            />
            <q-btn class="btn_search" label="검색" @click="onClickSearch" />
          </div>
        </div>
        <div class="main_tabs">
          <q-tabs v-model="tabs" dense class="main_tabs_wrapper">
            <q-tab name="movie">Movies</q-tab>
            <q-tab name="series">series</q-tab>
          </q-tabs>
        </div>
      </div>
      <q-tab-panels v-model="tabs" keep-alive>
        <q-tab-panel name="movie">
          <div class="contents_wrapper">
            <BarChartComp :size="chartSize" :x-axis="Xaxis" :series="series" />
            <!-- <div class="chart_area">
              <div ref="barChart" :style="chartSize" />
            </div> -->
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </main>
  </q-page>
</template>
<script lang="ts" setup>
//TODO: 검색 할 년도 선택 받기, 영화와 티비 시리즈 토탈 개수만 얻을수 있는 API 찾아보기
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '@/stores/useMainStore';
import progressConfig from '@/config/progressConfig';
import BarChartComp from './components/BarChartComp.vue';
import DateComp from '@/components/DateComp.vue';

const moiveStore = useMovieStore();
const { movieCountsByYear } = storeToRefs(moiveStore);

const tabs = ref('movie');

const now = new Date();
const currentYear = now.getFullYear();
const startYear = ref(String(currentYear - 5));
const endYear = ref(String(currentYear));

const barChart = ref();

const chartSize = {
  widht: '100%',
  height: '650px',
};

const series = computed(() => {
  const values = Object.values(movieCountsByYear.value);
  return [
    {
      data: values,
      type: 'bar',
      barWidth: 120,
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
      },
    },
  ];
});

const Xaxis = computed(() => {
  const years = Object.keys(movieCountsByYear.value);
  return [{ type: 'category', data: years }];
});

const onClickSearch = () => {
  getMovieList();
};

const getMovieList = async () => {
  progressConfig.show();
  try {
    const params = {
      startYear: startYear.value,
      endYear: endYear.value,
    };
    await moiveStore.fetchMoviesCount(params);
  } catch (error) {
    console.error(error);
  } finally {
    progressConfig.hide();
  }
};

onMounted(() => {
  getMovieList();
});

onBeforeMount(() => moiveStore.$reset());
</script>
