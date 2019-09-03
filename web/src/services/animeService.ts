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

const baseUrl = (process.env.APP_BASE_URL || "localhost:8000") + "/anime"

const optionsToQueryParams = (queryParams: any) =>
  Object.keys(queryParams)
    .filter(key => queryParams[key] !== null)
    .map(key => `${key}=${queryParams[key]}`)
    .join("&")

export function search(options: AnimeSearchOptions): Promise<Anime[]> {
  return fetch(
    `http://${baseUrl}/search?${optionsToQueryParams({
      orderBy: AnimeOrderBy.Score,
      ...options
    })}`
  ).then(res => res.json())
}
