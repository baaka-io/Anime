import fetch, { Response } from "node-fetch"
import { then, pipe, map, join, curry, defaultTo } from "ramda"

export type SearchAnimeOptions = {
	q?: string
	page?: number
}

export type AnimeSeason = "summer" | "spring" | "fall" | "winter"

export type Anime = any

const baseUrl = "https://api.jikan.moe/v3"
const animeUrl = baseUrl + "/search/anime"
const seasonUrl = baseUrl + "/season"

const responseToJson = (res: Response): Promise<any> => 
	res.json()

const optionsToQueryParams: <TOptions extends {}>(options: TOptions) => string =
	pipe(
		defaultTo({}),
		Object.entries,
		map(entry => `${entry[0]}=${entry[1]}`),
		join("&")
	)

const generateUrl =
	curry((url: string, options) => `${url}?${optionsToQueryParams(options)}`)

export const searchAnime: (options: SearchAnimeOptions) => Promise<Anime[]> = 
	pipe(
		generateUrl(animeUrl),
		fetch,
		then(responseToJson)
	)

export const getAnimesInSeason: (year: number, season: AnimeSeason) => Promise<Anime[]> =
	pipe(
		(year: number, season: AnimeSeason) => `${seasonUrl}/${year}/${season}`,
		fetch,
		then(responseToJson)
	)

export const getAnimesInCurrentSeason = (): Promise<Anime[]> =>
	getAnimesInSeason(2019, "spring")

