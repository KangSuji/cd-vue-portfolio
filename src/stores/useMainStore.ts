import { defineStore } from 'pinia';

enum APIUrl {
  trandMv = 'https://api.themoviedb.org/3/trending/movie/day?language=ko-KR',
  trandTv = 'https://api.themoviedb.org/3/trending/tv/day?language=ko-KR',
  discoverTv = 'https://api.themoviedb.org/3/discover/tv',
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
  trandMvList: [] as any,
  trandTvList: [] as any,
  monthlyMovieCount: [] as number[],
  monthlyTVCount: [] as number[],
});

const store = {
  id: 'useMovieStore',
  state,
  actions: {
    searchTrandMovieByDay,
    searchTrandTvByDay,
    fetchMonthlyMovieCounts,
    fetchMonthlyTvCounts,
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
// 이번년도 월별 개봉작(예정작)
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
// 이번년도 월별 TV개봉작(예정작)
async function fetchMonthlyTvCounts(year: number): Promise<void> {
  const monthRanges = getMonthRanges(year);

  const counts: number[] = [];
  for (const { gte, lte } of monthRanges) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?primary_release_date.gte=${gte}&primary_release_date.lte=${lte}`,
      options,
    ).then((res) => res.json());

    counts.push(res.total_results);
  }

  useMovieStore().monthlyTVCount = counts;
}
