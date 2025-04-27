<template>
  <div class="search_year">
    <q-select
      v-model="searchYear"
      :options="yearList"
      option-label="label"
      option-value="value"
      hide-dropdown-icon
      outlined
      @update:model-value="updateYears"
    >
      <q-icon name="event" />
    </q-select>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  /** 시작 날짜 */
  startYear: {
    type: String,
    default: '',
  },
  /** 종료 날짜 */
  endYear: {
    type: String,
    default: '',
  },
  /** 시작날짜로 사용 하는지 여부 */
  isStartYear: {
    type: Boolean,
    default: true,
  },
});
const now = new Date();
const currentYear = now.getFullYear();

const searchYear = ref<string>('');

// 연도 리스트 만들기
const yearList = Array.from(
  { length: currentYear - 2000 + 1 }, // +1 해서 현재 연도까지 포함
  (_, i) => {
    const year = 2000 + i;
    return { label: `${year}`, value: `${year}` };
  },
);

const emit = defineEmits(['updateDate']);

const initDate = () => {
  if (props.isStartYear) {
    searchYear.value = props.startYear !== '' ? props.startYear : String(currentYear - 5);
  } else {
    searchYear.value = props.endYear !== '' ? props.endYear : String(currentYear);
  }
};

const updateYears = (val) => {
  console.log('val', val);

  searchYear.value = val.value;
  emit('updateDate', searchYear.value);
};
onMounted(() => {
  initDate();
});
</script>
<style lang="scss" scoped></style>
