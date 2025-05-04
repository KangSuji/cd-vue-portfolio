<!--
  * Pie Chart - radius: '55%' (전체크기)
  * Doughnut Chart - radius: ['40%', '70%'] ([가운데여백, 전체크기])
  참고 : https://echarts.apache.org/examples/en/index.html
-->
<template>
  <div ref="pieChart" :style="chartProps.size" @click="onChartClicked" />
</template>

<script setup lang="ts">
import { PieChart } from 'echarts/charts';
import {
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import { theme } from '@/config/chartOptions';

echarts.use([
  PieChart,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
]);

const pieChart = ref();
const chartProps = defineProps({
  // 차트 사이즈 - width / height 지정
  size: {
    type: Object,
    default: () => {
      return { widht: '100%', height: '650px' };
    },
  },
  // 차트 제목
  title: {
    type: Object,
    required: false,
    default: () => {
      return {};
    },
  },
  // 차트 series 데이터
  series: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  // hover 툴팁
  tooltip: {
    type: Object,
    default: () => {
      {
        return {
          trigger: 'item',
          borderWidth: 0,
          padding: 0,
          backgroundColor: 'transparent',
          formatter: (params) => {
            return `
        <div class="tooltip_style">
          <p class="name">${params.name}년</p>
          <p class="data">${params.data}개</p>
        </div>
      `;
          },
          position: function (point, params, dom, rect, size) {
            return [point[0] + 20, point[1] - 30];
          },
        };
      }
    },
  },
  // 범례
  legend: {
    type: Object,
    default: () => {
      return {
        type: 'scroll',
        textStyle: {
          color: 'gray',
        },
        pageTextStyle: {
          color: 'gray',
        },
      };
    },
  },
  // 유틸리티 도구 그룹 (내보내기 , 데이터 보기 , 동적 유형 전환 , 데이터 영역 확대/축소 및 재설정)
  toolbox: {
    type: Object,
    required: false,
    default: () => {
      return {};
    },
  },

  // 그리드(여백)
  grid: {
    type: Object,
    default: () => {
      return { containLabel: true };
    },
  },
  // 그래프 애니메이션
  animation: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
});

const onChartClicked = (e) => {
  // console.log('onChartClicked', e);
};

let chart;
const drawChart = () => {
  if (chart) {
    chart.dispose();
  }

  // 차트 테마 적용
  echarts.registerTheme('theme', theme.theme);
  chart = echarts.init(pieChart.value, 'theme');
  chart.setOption({ ...chartProps }, true);
};

const chartResize = () => {
  chart.resize();
};

const getColor = () => {
  return chart.getOption()?.color;
};

const getDataUrl = () => {
  // 원래 옵션 저장
  const originalOption = chart.getOption();
  // 프린트 / 다운로드 시 옵션 저장
  const tempOption = JSON.parse(JSON.stringify(originalOption));

  tempOption.series?.forEach((s: any) => {
    s.animation = false;
    if (s.label) {
      s.label.show = true;
      s.label.color = '#111827';
    }
    if (s.labelLine) {
      s.labelLine.show = true;
    }
  });

  if (tempOption.legend) {
    tempOption.legend[0].right = '20%';

    const richNameIcon = tempOption.legend[0].textStyle?.rich?.nameIcon;
    const richIcon = tempOption.legend[0].textStyle?.rich?.icon;
    if (richIcon && richNameIcon) {
      richNameIcon.color = '#111827';
      richIcon.color = '#111827';
    }
  }
  if (tempOption.title && tempOption.title[0]) {
    const richTitle = tempOption.title[0].textStyle?.rich?.title;
    if (richTitle) {
      richTitle.color = '#111827';
    }
  }
  // 다시 원래 옵션으로 적용
  chart.setOption(tempOption, true);

  const dataUrl = chart.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff',
  });

  chart.setOption(originalOption, true);

  return dataUrl;
};

onMounted(() => {
  drawChart();

  window.addEventListener('resize', chartResize);
});

onUpdated(() => {
  drawChart();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', chartResize);
});

defineExpose({ getColor, getDataUrl });
</script>
<style lang="scss" scoped></style>
