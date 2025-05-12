import { defineStore } from 'pinia';

enum APIUrl {
  trend = 'https://api.themoviedb.org/3/trending',
  discover = 'https://api.themoviedb.org/3/discover',
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
  trendMvList: [] as any,
  trendTvList: [] as any,
  monthlyMovieCount: [] as number[],
  monthlyTVCount: [] as number[],
  totalMovies: 0 as number,
  monthlyMovieReleases: [] as any[], // 새로운 상태 추가
  trendList: [] as any,
});

const store = {
  id: 'useMovieStore',
  state,
  actions: {
    searchTrendMovieByDay,
    searchTrendTvByDay,
    fetchMonthlyMovieCounts,
    fetchMonthlyTvCounts,
    fetchMonthlyMovieReleases,
    getTrendingAllList,
  },
};
export const useMovieStore = defineStore('useMovieStore', store);

// 오늘 트랜드 영화
async function searchTrendMovieByDay() {
  const res = await fetch(`${APIUrl.trend}/movie/day?language=ko-KR`, options).then((res) =>
    res.json(),
  );
  useMovieStore().trendMvList = res?.results ?? [];
}

// 오늘 트랜드 TV 시리즈
async function searchTrendTvByDay() {
  const res = await fetch(`${APIUrl.trend}/tv/day?language=ko-KR`, options).then((res) =>
    res.json(),
  );
  useMovieStore().trendTvList = res?.results ?? [];
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
      `${APIUrl.discover}/movie?primary_release_date.gte=${gte}&primary_release_date.lte=${lte}&language=ko-KR&region=KR`,
      options,
    ).then((res) => res.json());
    counts.push(res.total_results);
  }
  useMovieStore().monthlyMovieCount = counts;
}

// 입력 년도 총 개봉작
async function fetchMonthlyMovieReleases(year: number): Promise<number> {
  const gte = new Date(year, 1, 1).toISOString().slice(0, 10);
  const lte = new Date(year, 12, 0).toISOString().slice(0, 10);

  const res = await fetch(
    `${APIUrl.discover}/movie?primary_release_date.gte=${gte}&primary_release_date.lte=${lte}&language=ko-KR&region=KR`,
    options,
  ).then((res) => res.json());

  return res.total_results ?? 0;
}

// 이번년도 월별 TV개봉작(예정작)
async function fetchMonthlyTvCounts(year: number): Promise<void> {
  const monthRanges = getMonthRanges(year);

  const counts: number[] = [];
  for (const { gte, lte } of monthRanges) {
    const res = await fetch(
      `${APIUrl.discover}/tv?primary_release_date.gte=${gte}&primary_release_date.lte=${lte}&language=ko-KR&region=KR`,
      options,
    ).then((res) => res.json());

    counts.push(res.total_results);
  }

  useMovieStore().monthlyTVCount = counts;
}

async function getTrendingAllList() {
  const res = await fetch(`${APIUrl.trend}/all/day?language=ko-KR'`, options).then((res) =>
    res.json(),
  );

  useMovieStore().trendList = res;
}
