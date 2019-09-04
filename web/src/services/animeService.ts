import {
  AnimeType,
  AnimeStatus,
  AnimeRating,
  AnimeGenre,
  AnimeOrderBy,
  AnimeSort,
  MalId,
  Anime
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

export function search(
  options: AnimeSearchOptions,
  abortSignal?: AbortSignal
): Promise<AnimeSearchResult> {
  return fetch(
    `${baseUrl}/search?${objectToQueryParams({
      orderBy: AnimeOrderBy.Score,
      ...options
    })}`,
    {
      signal: abortSignal
    }
  ).then(res => res.json())
}
