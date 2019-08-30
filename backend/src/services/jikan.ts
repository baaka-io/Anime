import fetch, { Response } from "node-fetch"
import { then, pipe, map, join, curry, defaultTo } from "ramda"
import cond from "ramda/es/cond";
import always from "ramda/es/always";

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
		then(responseToJson),
		then(res => res.anime)
	)

const between = (x: number, y: number) => (z: number) => x >= z && x <= y

const dateToSeasonName = (date: Date) => cond<number, AnimeSeason>([
	[between(1, 3), always("winter")],
	[between(4, 6), always("spring")],
	[between(7, 9), always("summer")],
	[between(10, 12), always("fall")]
])(date.getMonth() + 1)

const getCurrentSeason = (): [number, AnimeSeason] => {
	const date = new Date()
	return [date.getFullYear(), dateToSeasonName(date)]
}

export const getAnimesInCurrentSeason = (): Promise<Anime[]> =>
	getAnimesInSeason(...getCurrentSeason())

