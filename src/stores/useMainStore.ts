import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

enum APIUrl {
  api = 'https://api.themoviedb.org/3/discover/movie',
}
const state = () => ({
  movieCountsByYear: {} as Record<string, number>,
});

const store = {
  id: 'useMovieStore',
  state,
  actions: {
    fetchMoviesCount,
  },
};
export const useMovieStore = defineStore('useMovieStore', store);

export async function fetchMoviesCount(params: { startYear: string; endYear: string }) {
  const start = Number(params.startYear);
  const end = Number(params.endYear);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const counts: Record<string, number> = {};

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };

  for (let year = start; year <= end; year++) {
    const res = await fetch(
      `${APIUrl.api}?include_adult=false&include_video=false&language=ko&page=1&region=korea&sort_by=popularity.desc&year=${year}`,
      options,
    ).then((res) => res.json());

    counts[year] = res?.total_results || 0;
  }

  useMovieStore().movieCountsByYear = counts;
}
