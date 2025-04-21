/**
 * https://echarts.apache.org/en/theme-builder.html
 */

// const themeStore = useThemeStore();
// const { theme: pageTheme } = storeToRefs(themeStore);

// const _themeText = computed(() => {
//   return pageTheme.value == ThemeType.LIGHT ? '#000' : '#fff';
// });

// export const theme = computed(() => {
//   _theme.theme.legend.textStyle.color = _themeText.value;

//   return _theme;
// });

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
      '#facc15',
      '#24E4EB',
      '#D92993',
      '#2AD585',
      '#FFDB29',
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
