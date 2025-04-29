import { defineStore } from 'pinia';

enum APIUrl {
  base = 'https://api.themoviedb.org/3/discover',
  movie = base + '/movie',
  tv = base + '/tv',
}
const state = () => ({
  countsByYear: {} as Record<string, number>,
});

const store = {
  id: 'useMovieStore',
  state,
  actions: {
    fetchCount,
  },
};
export const useMovieStore = defineStore('useMovieStore', store);

export async function fetchCount(params: { type: string; startYear: string; endYear: string }) {
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
    let url = '';
    if (params.type === 'movie')
      url = `${APIUrl.movie}?include_adult=false&include_video=false&language=ko&page=1&region=korea&sort_by=popularity.desc&year=${year}`;
    if (params.type === 'tv')
      url = `${APIUrl.tv}?first_air_date_year=${year}&include_adult=false&include_null_first_air_dates=false&language=ko-KR&page=1&sort_by=popularity.desc`;
    const res = await fetch(url, options).then((res) => res.json());
    counts[year] = res?.total_results || 0;
  }

  useMovieStore().countsByYear = counts;
}
