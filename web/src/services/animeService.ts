import {
  AnimeType,
  AnimeStatus,
  AnimeRating,
  AnimeGenre,
  AnimeOrderBy,
  AnimeSort,
  MalId,
  Anime,
  AnimeSeason
} from "../entities/Anime"
import { objectToQueryParams } from "../util/queryParam"

export class AnimeSearchOptions {
  title?: string | null
  page?: number | null
  type?: AnimeType | null
  status?: AnimeStatus | null
  rated?: AnimeRating | null
  genre?: AnimeGenre[] | null
  score?: number | null
  startDate?: string | null
  endDate?: string | null
  genreExclude?: boolean | null
  limit?: number | null
  orderBy?: AnimeOrderBy | null
  sort?: AnimeSort | null
  producer?: MalId | null
  magazine?: MalId | null
}

export type AnimeSearchResult = {
  results: Anime[]
  last_page: number
}

const baseUrl = (process.env.APP_BASE_URL || "http://localhost:8000") + "/anime"

function request(method: string, url: string, signal?: AbortSignal) {
  return fetch(`${baseUrl}/${url}`, {
    method,
    signal
  }).then(res => res.json())
}

export function search(
  options: AnimeSearchOptions,
  abortSignal?: AbortSignal
): Promise<AnimeSearchResult> {
  return request(
    "get",
    `search?${objectToQueryParams({
      orderBy: AnimeOrderBy.Score,
      ...options
    })}`,
    abortSignal
  )
}

export function searchBySeason(
  year: number,
  season: AnimeSeason,
  abortSignal?: AbortSignal
): Promise<Anime[]> {
  return request("get", `season?year=${year}&season=${season}`, abortSignal)
}

export function getEpisodes(title: string, abortSignal?: AbortSignal) {
  return request("get", `episodes?title=${title}`, abortSignal)
}

export function createVideoUrl(subUrl: string) {
  return `${baseUrl}/video?subUrl=${subUrl}`
}
