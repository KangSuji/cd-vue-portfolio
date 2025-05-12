import { useThemeStore } from '@/stores/useThemeStore';

export enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light',
}

// 로컬 스토리지에 테마 값이 없는 경우에만 초기값 설정
if (!window.localStorage.getItem('theme')) {
  window.localStorage.setItem('theme', JSON.stringify('dark'));
}

/**
 * 저장된 테마 불러오기
 * @returns : 기본값 dark
 */
export function getTheme(): ThemeType {
  const myTheme = window.localStorage.getItem('theme');
  switch (myTheme) {
    case JSON.stringify('dark'):
      return ThemeType.DARK;
    case JSON.stringify('light'):
      return ThemeType.LIGHT;
    default:
      return ThemeType.DARK;
  }
}

/**
 * 테마 저장
 * @param myTheme
 */
export function setTheme(myTheme: ThemeType) {
  window.localStorage.setItem('theme', JSON.stringify(myTheme));
  useThemeStore().setTheme(getTheme());
}

/** 테마 적용 */
export function applyTheme(myTheme: ThemeType) {
  const bodyTag = document.body;
  const themeClasses = ['body--light', 'body--dark'];

  bodyTag.classList.remove(...themeClasses);
  bodyTag.classList.add(`body--${myTheme.toLowerCase()}`);

  setTheme(myTheme);
}

/**
 * 테마 불러오기
 */
export function loadTheme() {
  const myTheme = getTheme();
  setTheme(myTheme);
  applyTheme(myTheme);
}
