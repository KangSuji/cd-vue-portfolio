<template>
  <q-page>
    <div class="page_container trand-container">
      <div class="trand-wrap">
        <q-carousel
          v-model="slide"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          navigation
          padding
          arrows
          infinite
        >
          <template v-for="(group, groupIndex) in groupedTrendContents" :key="groupIndex">
            <q-carousel-slide :name="groupIndex" class="row wrap justify-around">
              <div v-for="(content, index) in group" :key="index" class="trend-item">
                <p class="trend-item-title">{{ content.title }}</p>
                <img class="rounded-borders full-height" :src="content.image" />
              </div>
            </q-carousel-slide>
          </template>
        </q-carousel>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMovieStore } from '@/stores/useMainStore';
import { computed, onMounted, ref } from 'vue';
import progressConfig from '@/config/progressConfig';

interface Contents {
  title: string;
  image: string;
  description: string;
  releaseDate: string;
  rating: number;
}

const movieStore = useMovieStore();
const { trendList } = storeToRefs(movieStore);

const slide = ref(1);

// 한 슬라이드에 표시할 콘텐츠 개수
const itemsPerSlide = 5;

const makeTrendContents = computed(() => {
  const trendListData = trendList.value?.results ?? [];
  console.log('trendListData', trendListData);

  return trendListData.map((item) => {
    return {
      title: item.title ?? item.name,
      image: `https://media.themoviedb.org/t/p/w220_and_h330_face/${item.poster_path}`,
      description: item.overview,
      releaseDate: item.first_air_date ?? item.release_date,
      rating: item.rating,
    };
  });
});

// 콘텐츠를 그룹화하여 한 슬라이드에 여러 개 배치
const groupedTrendContents = computed(() => {
  const contents: Contents[] = makeTrendContents.value;
  const groups: Array<Contents[]> = [];
  for (let i = 0; i < contents.length; i += itemsPerSlide) {
    groups.push(contents.slice(i, i + itemsPerSlide));
  }
  return groups;
});

const getTrendingList = async () => {
  progressConfig.show();
  try {
    await useMovieStore().getTrendingAllList();
  } catch (error) {
    console.error('Error fetching trend list:', error);
  } finally {
    progressConfig.hide();
  }
};

onMounted(() => {
  getTrendingList();
});
</script>

<style lang="scss" scoped>
.trand-wrap {
  height: calc(100vh - 120px);
}
.q-carousel {
  height: max-content;
  background-color: transparent;
}
.trend-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;
  text-align: center;
  .trend-item-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }
}
:deep(.q-carousel__navigation--bottom) {
  bottom: -10px !important;
}
</style>
