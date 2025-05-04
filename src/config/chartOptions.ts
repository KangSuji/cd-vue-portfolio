/**
 * https://echarts.apache.org/en/theme-builder.html
 */
/** 테마 관련 */
export const theme = {
  version: 1,
  themeName: 'theme',
  theme: {
    seriesCnt: '4',
    backgroundColor: 'rgba(0,0,0,0)',
    titleColor: '#333333',
    subtitleColor: '#aaaaaa',
    textColorShow: false,
    textColor: '#333',
    markTextColor: '#eeeeee',
    color: [
      '#0088FE',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#8884D8',
      '#FFB650',
      '#DD81FF',
      '#5086F1',
      '#FF5555',
      '#00B020',
      '#1F01C7',
      '#FF8C42',
    ],
    categoryAxis: {
      axisLabel: {
        show: true,
        color: '#7b7b7b',
      },
    },
    valueAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: '#4b4b4b',
        },
      },
      axisLabel: {
        show: true,
        color: '#7b7b7b',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#b6b6b6'],
        },
      },
    },
  },
};
