import fetch, { Response } from "node-fetch"
import {
  then,
  pipe,
  map,
  join,
  curry,
  defaultTo,
  cond,
  always,
  tap,
  omit,
  pick
} from "ramda"
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
import any from "ramda/es/any"

export type SearchAnimeOptions = {
  q?: string
  page?: number
  type?: AnimeType
  status?: AnimeStatus
  rated?: AnimeRating
  genre?: AnimeGenre[]
  score?: number
  /**
   * yyyy-mm-dd
   */
  start_date?: string
  end_date?: string
  genre_exclude?: boolean
  limit?: number
  order_by?: AnimeOrderBy
  sort?: AnimeSort
  /**
   * mal id of producer
   */
  producer?: MalId
  /**
   * mal id of magazine
   */
  magazine?: MalId
}

const baseUrl = "https://api.jikan.moe/v3"
const animeUrl = baseUrl + "/search/anime"
const seasonUrl = baseUrl + "/season"

const responseToJson = (res: Response): Promise<any> => res.json()

const optionsToQueryParams: <TOptions extends {}>(
  options: TOptions
) => string = pipe(
  defaultTo({}),
  Object.entries,
  map(entry => `${entry[0]}=${entry[1]}`),
  join("&")
)

const generateUrl = curry(
  (url: string, options) => `${url}?${optionsToQueryParams(options)}`
)

export type SearchAnimeResult = {
  results: Anime[]
  last_page: number
}
export const searchAnime: (
  options: SearchAnimeOptions
) => Promise<SearchAnimeResult> = pipe(
  generateUrl(animeUrl),
  fetch,
  then(responseToJson),
  then(json => pick(["results", "last_page"])(json) as any)
)

export const getAnimesInSeason: (
  year: number,
  season: AnimeSeason
) => Promise<Anime[]> = pipe(
  (year: number, season: AnimeSeason) => `${seasonUrl}/${year}/${season}`,
  fetch,
  then(responseToJson),
  then(res => res.anime)
)

const between = (x: number, y: number) => (z: number) => x >= z && x <= y

const dateToSeasonName = (date: Date) =>
  cond<number, AnimeSeason>([
    [between(1, 3), always(AnimeSeason.Winter)],
    [between(4, 6), always(AnimeSeason.Spring)],
    [between(7, 9), always(AnimeSeason.Summer)],
    [between(10, 12), always(AnimeSeason.Fall)]
  ])(date.getMonth() + 1)

const getCurrentSeason = (): [number, AnimeSeason] => {
  const date = new Date()
  return [date.getFullYear(), dateToSeasonName(date)]
}

export const getAnimesInCurrentSeason = (): Promise<Anime[]> =>
  getAnimesInSeason(...getCurrentSeason())
