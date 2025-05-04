<template>
  <div class="main__card">
    <div class="main__card__title-area">
      <q class="main__card__title-area--title">title</q>
      <span class="material-symbols-rounded"> {{ props.content.icon }} </span>
    </div>

    <div class="main__card__content">
      <p class="number">12,345</p>
      <p class="txt">{{ content.discription }}</p>
    </div>

    <div
      class="main__card__increase"
      :class="{
        increase: props.content.increase && isIncrease,
        decrease: props.content.increase && !isIncrease,
      }"
    >
      <span v-if="props.content.increase && isIncrease" class="material-symbols-rounded">
        arrow_upward
      </span>
      <span v-if="props.content.increase && !isIncrease" class="material-symbols-rounded">
        arrow_downward
      </span>
      <span>{{ increaseStr }} </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type PropType } from 'vue';

export interface Contents {
  icon: string;
  conent: string;
  increase: string;
  discription: string;
}

const props = defineProps({
  content: {
    type: Object as PropType<Contents>,
    default: () => ({
      icon: 'movie',
      conent: '',
      increase: '',
      discription: '',
    }),
  },
});

const isIncrease = ref(true);
const increaseStr = ref(props.content.increase);
</script>
