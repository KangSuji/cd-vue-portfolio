import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

enum APIUrl {
  api = 'https://api.themoviedb.org/3/discover/movie',
}
export const useUserStore = defineStore('user', {
  state: () => ({
    movieCountsByYear: {} as Record<string, number>,
  }),
  actions: {
    async fetchMoviesCount(year?: number) {
      if (year) console.log(year);
      const years = [2020, 2021, 2022, 2023, 2024, 2025];
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const counts: Record<string, number> = {};

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      };

      for (const year of years) {
        const res = await fetch(
          `${APIUrl.api}?include_adult=false&include_video=false&language=ko&page=1&region=korea&sort_by=popularity.desc&year=${year}`,
          options,
        ).then((res) => res.json());
        counts[year] = res?.total_results;
      }

      this.movieCountsByYear = counts;
    },
  },
});
