import { defineStore } from 'pinia';

enum APIUrl {
  base = 'https://api.themoviedb.org/3/',
  rateMv = base + 'movie/top_rated?language=ko-KR&page=1',
  trandMv = base + 'trending/movie/day?language=ko-KR',
  discoverMv = 'https://api.themoviedb.org/3/discover/movie',
  discoverTv = base + 'discover/tv',
  mvGenre = 'https://api.themoviedb.org/3/genre/movie/list',
}

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
};

const state = () => ({
  countsByGenre: {} as Record<string, number>,
  rateMvList: [] as any,
  trandMvList: [] as any,
  countGenres: {} as Record<string, any>,
});

const store = {
  id: 'useMovieStore',
  state,
  actions: {
    searchTrandDay,
    getGenreMovieCounts,
  },
};
export const useMovieStore = defineStore('useMovieStore', store);

export async function searchTrandDay() {
  const res = await fetch(APIUrl.trandMv, options).then((res) => res.json());
  useMovieStore().trandMvList = res?.results ?? [];
}

async function getGenreMovieCounts() {
  const genreListRes = await fetch(`${APIUrl.mvGenre}?language=ko`, options).then((res) =>
    res.json(),
  );

  const { genres } = await genreListRes;

  const counts: Record<string, number> = {};

  for (const genre of genres) {
    const res = await fetch(
      `${APIUrl.discoverMv}?include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc&with_genres=${genre.id}`,
      options,
    ).then((res) => res.json());

    counts[genre.name] = res.total_results;
  }
  useMovieStore().countGenres = counts;
}
