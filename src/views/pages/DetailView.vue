<template>
  <q-page>
    <div class="page_container detail-container">
      <div class="detail-wrap">
        <p class="detail__title">Detail</p>
        <q-btn @click="router.go(-1)" label="Go Back" color="primary" />
        <div class="detail_card">
          <div class="detail_card--bg" :style="bgImageStyle"></div>
          <div>
            <img
              :src="`https://media.themoviedb.org/t/p/w220_and_h330_face/${contentsDetail.poster_path}`"
            />
            <p class="detail-card__title">{{ contentsDetail.title }}</p>
            <p class="detail-card__description">{{ contentsDetail.overview }}</p>
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

const router = useRouter();
const route = useRoute();

const movieStore = useMovieStore();
const { movieDetil, tvDetail } = storeToRefs(movieStore);

const contentId = ref(route?.params?.id ?? '');
const category = ref<string>((route?.params?.category ?? '') as string);

const contentsDetail = computed(() => {
  const type = category.value?.toString() || 'movie';
  if (type === 'movie') {
    const detail = movieDetil.value ?? {};
    return detail;
  } else {
    return tvDetail.value;
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
<style scoped lang="scss">
.detail_card {
  width: 100%;
  height: 100%;
  position: relative;

  .detail_card--bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 500px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 12px;
    z-index: 1;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      /* 아래에서 위로 옅어지는 검정 그라데이션 */
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.1) 70%,
        rgba(0, 0, 0, 0) 100%
      );
      z-index: 2;
      pointer-events: none;
    }
  }

  > div:not(.detail_card--bg) {
    position: relative;
    z-index: 3;
    /* 필요시 padding 등 추가 */
  }
}
</style>
