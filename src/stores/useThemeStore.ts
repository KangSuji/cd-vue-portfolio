import { acceptHMRUpdate, defineStore } from 'pinia';

/**
 * @notExported
 * StoreState 상태 관리 항목 인터페이스
 */
interface themeState {
  /** 테마 설정 */
  theme: string;
}

export const useThemeStore = defineStore('useThemeStore', {
  state: (): themeState => {
    return {
      theme: 'dark' as string,
    };
  },
  actions: {
    /** 테마 설정값 저장 */
    async setTheme(theme: string) {
      this.theme = theme;
    },
  },
  getters: {
    getTheme(): string {
      return this.theme;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot));
}
