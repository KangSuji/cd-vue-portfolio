import { defineStore } from 'pinia';

enum APIUrl {
  base = 'https://api.themoviedb.org/3/',
  rateMv = 'https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1',
  trandMv = 'https://api.themoviedb.org/3/trending/movie/day?language=ko-KR',
  trandTv = 'https://api.themoviedb.org/3/trending/tv/day?language=ko-KR',
  discoverMv = 'https://api.themoviedb.org/3/discover/movie',
  discoverTv = 'https://api.themoviedb.org/3/discover/tv',
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
  trandTvList: [] as any,
  countMoviesGenres: {} as Record<string, any>,
  countTVGenres: {} as Record<string, any>,
  monthlyMovieCount: [] as number[],
  heatmapData: [] as number[][],
});

const store = {
  id: 'useMovieStore',
  state,
  actions: {
    searchTrandMovieByDay,
    searchTrandTvByDay,
    getGenreMovieCounts,
    getGenreTvCounts,
    fetchMonthlyMovieCounts,
    fetchHeatmapData,
  },
};
export const useMovieStore = defineStore('useMovieStore', store);

// 오늘 트랜드 영화
async function searchTrandMovieByDay() {
  const res = await fetch(APIUrl.trandMv, options).then((res) => res.json());
  useMovieStore().trandMvList = res?.results ?? [];
}

// 오늘 트랜드 TV 시리즈
async function searchTrandTvByDay() {
  const res = await fetch(APIUrl.trandTv, options).then((res) => res.json());
  useMovieStore().trandTvList = res?.results ?? [];
}

// 영화 장르 별 개수 조회
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
  useMovieStore().countMoviesGenres = counts;
}

// TV 장르 별 개수 조회
async function getGenreTvCounts() {
  const genreListRes = await fetch(`${APIUrl.mvGenre}?language=ko`, options).then((res) =>
    res.json(),
  );

  const { genres } = await genreListRes;

  const counts: Record<string, number> = {};

  for (const genre of genres) {
    const res = await fetch(
      `${APIUrl.discoverTv}?include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc&with_genres=${genre.id}`,
      options,
    ).then((res) => res.json());

    counts[genre.name] = res.total_results;
  }
  useMovieStore().countTVGenres = counts;
}

function getMonthRanges(year: number) {
  const ranges: { gte: string; lte: string }[] = [];
  for (let month = 0; month < 12; month++) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // 해당 월의 마지막 날
    const gte = start.toISOString().slice(0, 10);
    const lte = end.toISOString().slice(0, 10);
    ranges.push({ gte, lte });
  }
  return ranges;
}

async function fetchMonthlyMovieCounts(year: number): Promise<void> {
  const monthRanges = getMonthRanges(year);

  const counts: number[] = [];
  for (const { gte, lte } of monthRanges) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${gte}&primary_release_date.lte=${lte}`,
      options,
    ).then((res) => res.json());

    counts.push(res.total_results);
  }

  useMovieStore().monthlyMovieCount = counts;
}

async function fetchHeatmapData(year = 2025) {
  const results: number[][] = [];

  const getMonthRange = (year: number, month: number) => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      gte: start.toISOString().slice(0, 10),
      lte: end.toISOString().slice(0, 10),
    };
  };

  for (let m = 0; m < 12; m++) {
    const { gte, lte } = getMonthRange(year, m);
    let page = 1;
    let totalPages = 1;
    const monthlyBins = Array(10).fill(0);
    // 성능 문제로 10페이지 까지만 조회
    while (page <= 10) {
      const url = `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${gte}&primary_release_date.lte=${lte}&page=${page}`;
      const res = await fetch(url, options).then((res) => res.json());
      if (!res.results) break;

      res.results.forEach((movie: any) => {
        const avg = movie.vote_average;
        const idx = Math.min(Math.floor(avg), 9);
        monthlyBins[idx]++;
      });

      totalPages = res.total_pages;
      page++;
    }

    // [xIndex, yIndex, value]
    monthlyBins.forEach((count, binIdx) => {
      results.push([binIdx, m, count]);
    });
  }

  useMovieStore().heatmapData = results;
}
