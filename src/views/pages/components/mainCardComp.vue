<template>
  <div class="main__card">
    <div class="main__card__title-area">
      <q class="main__card__title-area--title">{{ content.title }}</q>
      <span class="material-symbols-rounded"> {{ props.content.icon }} </span>
    </div>

    <div class="main__card__content">
      <p class="number">{{ content.conent }}</p>
    </div>
    <div
      class="main__card__increase"
      :class="{
        increase: props.content.increase && isIncrease,
        decrease: props.content.increase && !isIncrease,
      }"
    >
      <template v-if="props.content.increase">
        <span v-if="isIncrease" class="material-symbols-rounded"> arrow_upward </span>
        <span v-if="!isIncrease" class="material-symbols-rounded"> arrow_downward </span>
        <span>{{ `${props.content.increase}%` }} </span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';

export interface Contents {
  icon: string;
  title: string;
  conent: string | number;
  increase?: number;
  discription: string;
}

const props = defineProps({
  content: {
    type: Object as PropType<Contents>,
    default: () => ({
      icon: 'movie',
      title: '',
      conent: '',
      increase: undefined,
      discription: '',
    }),
  },
});

const isIncrease = ref(true);

watch(
  () => props.content,
  () => {
    isIncrease.value = Number(props.content.increase) > 0;
  },
);
</script>
