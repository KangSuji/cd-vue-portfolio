<template>
  <q-page>
    <div class="page_container detail-container">
      <div class="detail-wrap">
        <div class="detail_card">
          <div class="detail_card--bg" :style="bgImageStyle"></div>
          <div class="detail_card--content_area">
            <img
              :src="`https://media.themoviedb.org/t/p/w220_and_h330_face/${contentsDetail.poster_path}`"
            />
            <div class="detail_card--content">
              <div class="detail-card-title-area">
                <p class="detail-card--title">{{ contentsDetail.title }}</p>
                <p class="detail-card--title">{{ contentsDetail.original_title }}</p>
                <p class="detail-card--title">{{ contentsDetail.tagline }}</p>
              </div>
              <div class="flex items-center">
                <template v-for="(genre, index) in contentsDetail.genres" :key="index">
                  <span class="detail-card--genres">{{ genre.name }}</span>
                </template>
              </div>
              <div class="detail-card--info-area">
                <span class="material-symbols-rounded star"> star </span>
                <p class="detail-card--title">{{ contentsDetail.rate }}</p>
                <span class="material-symbols-rounded calendar"> calendar_month </span>
                <p class="detail-card--title">{{ contentsDetail.release_date }}</p>
                <span class="material-symbols-rounded schedule"> schedule </span>
                <p class="detail-card--title">{{ contentsDetail.runtime }} 분</p>
              </div>
              <div class="detail-card--description-area">
                <p class="detail_card--sub-title">개요</p>
                <p class="detail-card--description">{{ contentsDetail.overview }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
//router
import { useRoute, useRouter } from 'vue-router';
// store
import { storeToRefs } from 'pinia';
import { useMovieStore } from '@/stores/useMainStore';

interface ContentsDetail {
  id: number;
  title: string;
  original_title: string;
  tagline: string;
  genres: Array<{ id: number; name: string }>;
  rate: number;
  release_date: string;
  runtime: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
}

const router = useRouter();
const route = useRoute();

const movieStore = useMovieStore();
const { movieDetil, tvDetail } = storeToRefs(movieStore);

const contentId = ref(route?.params?.id ?? '');
const category = ref<string>((route?.params?.category ?? '') as string);

const contentsDetail = computed<ContentsDetail>(() => {
  const type = category.value?.toString() || 'movie';
  if (type === 'movie') {
    const movie = movieDetil.value;
    if (!movie) return {} as ContentsDetail;
    return {
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      tagline: movie.tagline,
      genres: movie.genres,
      rate: movie.vote_average,
      release_date: movie.release_date,
      runtime: movie.runtime,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
    };
  } else {
    // tvDetail.value가 ContentsDetail 타입과 호환된다고 가정
    return tvDetail.value as ContentsDetail;
  }
});

const bgImageStyle = computed(() => {
  if (!contentsDetail.value?.backdrop_path) return {};
  return {
    backgroundImage: `url(https://media.themoviedb.org/t/p/w780${contentsDetail.value.backdrop_path})`,
  };
});

const getContentDetail = async () => {
  const type = category.value?.toString() || 'movie';
  const id = Number(contentId.value);
  try {
    movieStore.getContentDetail(id, type);
  } catch (error) {
    console.error('Error fetching content detail:', error);
  } finally {
  }
};

onMounted(() => {
  getContentDetail();
});
</script>
<style scoped lang="scss"></style>
