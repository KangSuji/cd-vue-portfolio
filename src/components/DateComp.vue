<template>
  <div class="search_year">
    <q-input v-model="searchDate" mask="date" :rules="['date']" outlined readonly>
      <template #append>
        <q-icon v-show="isShowDateIcon" name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="searchDate" mode="years" @update:model-value="updateDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
<script setup lang="ts">
/**
 * 날짜 검색 공통 컴포넌트
 */
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  /** 시작 날짜 */
  startDate: {
    type: String,
    default: '',
  },
  /** 종료 날짜 */
  endDate: {
    type: String,
    default: '',
  },
  /** 시작날짜로 사용 하는지 여부 */
  isStartDate: {
    type: Boolean,
    default: true,
  },
});

const searchDate = ref<string>('');

/**
 * 날짜 변경 팝업 아이콘 활성화 여부
 */
const isShowDateIcon = ref<boolean>(true);

const emit = defineEmits(['updateDate']);

/**
 * year,month,day 객체 값을 v-model 값 yyyy-mm-dd 포맷으로바꿔 값 업데이트
 * @param value New model value (값)
 * @param reason Reason of the user interaction (what was picked)
 * @param details Object of properties on the new model (객체 값)
 */
const updateDate = (value, reason, details): void => {
  searchDate.value =
    details.year +
    '-' +
    (details.month >= 10 ? details.month : '0' + details.month) +
    '-' +
    (details.day >= 10 ? details.day : '0' + details.day);
};

/**
 * 초기 값 설정
 */
const initDate = (): void => {
  if (!isShowDateIcon.value) {
    searchDate.value = '';
  }
  if (props.isStartDate) {
    // searchDate.value =
    //   props.startDate != '' ? props.startDate.replace(/-/g, '/') : dayjs().format('YYYY/MM/DD');
  }
  if (!props.isStartDate) {
    // searchDate.value =
    //   props.endDate != '' ? props.endDate.replace(/-/g, '/') : dayjs().format('YYYY/MM/DD');
  }
};

/**
 * 시작날짜일경우 startDate 이전의 날짜 비활성화
 * 끝날짜일경우 endDate 이전의 날짜 비활성화
 * @param date 입력되어 있는 날짜
 */
const beforeOrAfterDay = (date: string): boolean => {
  return true;
};

/**
 * 오늘 날짜로 값 초기화
 */
const setToday = (): string => {
  return '';
};

watch(
  () => searchDate.value,
  () => {
    emit('updateDate', searchDate.value);
  },
);

/** startDate 변경 시 날짜 재 설정 */
watch(
  () => props.startDate,
  () => {
    initDate();
  },
);

/** endDate 변경 시 날짜 재 설정 */
watch(
  () => props.endDate,
  () => {
    initDate();
  },
);

onMounted(() => {
  initDate();
});

defineExpose({ setToday });
</script>
<style lang="scss" scoped>
.search_year {
  width: 200px;
}
.q-input {
  width: fit-content;
  border: 1px solid #eee;
  outline: none;
  border-radius: 8px;
  .q-icon {
    color: var(--primary);
  }
}
</style>
