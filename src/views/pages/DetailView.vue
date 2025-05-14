<template>
  <q-page>
    <div class="page_container detail-container">
      <div class="detail-wrap">
        <div class="flex items-center">
          <p class="detail__title">Detail</p>
        </div>
        <div class="detail_card">
          <div class="detail_card--bg" :style="bgImageStyle"></div>
          <div class="detail_card--content_area">
            <img
              :src="`https://media.themoviedb.org/t/p/w220_and_h330_face/${contentsDetail.poster_path}`"
            />
            <div class="detail_card--content">
              <p class="detail-card__title">{{ contentsDetail.title }}</p>
              <p class="detail-card__title">{{ contentsDetail.original_title }}</p>
              <p class="detail-card__description">{{ contentsDetail.overview }}</p>
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
.detail-container {
  //max-width: 1440px;
  //margin: 0 auto;
  .detail-wrap {
    margin-top: 24px;
    .detail__title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .detail_card {
      width: 100%;
      height: 100%;
      position: relative;
      padding: 20px 32px;
      &--bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 500px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 12px 12px 0;
        z-index: 1;

        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 101%;
          border-radius: 12px 12px 0;
          background: linear-gradient(
            to top,
            rgba(9, 9, 11, 1) 0%,
            rgba(9, 9, 11, 0.5) 70%,
            rgba(9, 9, 11, 0) 100%
          );
          z-index: 2;
          pointer-events: none;
        }
      }

      > div:not(.detail_card--bg) {
        position: relative;
        z-index: 3;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .detail_card--content_area {
        img {
          border-radius: 8px;
        }
      }
      &--content {
        width: 100%;
        .detail-card__title {
          font-size: 32px;
          font-weight: 700;
          color: var(--dark-txt);
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>
