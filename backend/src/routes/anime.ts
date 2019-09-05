import { Router } from "express"
import {
  getUrlOfAnimeEpisode,
  getEpisodeUrlsOfAnime
} from "../services/kissAnime"
import { memoizeWith, cond, equals, always, T, identity } from "ramda"
import {
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsEnum,
  IsBoolean
} from "class-validator"
import { ValidatedRequest, validateQuery } from "../middlewares/validation"
import {
  searchAnime,
  SearchAnimeOptions,
  getAnimesInSeason
} from "../services/jikan"
//@ts-ignore
import proxy from "http-proxy-stream"
import {
  AnimeType,
  AnimeStatus,
  AnimeRating,
  AnimeGenre,
  AnimeOrderBy,
  AnimeSort,
  MalId
} from "../entities/Anime"
import { arrayQueryParams } from "../middlewares/arrayQueryParams"
import {
  getCurrentAnimeReleases,
  refetchAnimeReleases
} from "../core/animeReleases"

const getUrlOfAnimeEpisodeMemoized = memoizeWith(identity, getUrlOfAnimeEpisode)

export class SearchQuery {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number
  @IsEnum(AnimeType)
  @IsOptional()
  type?: AnimeType
  @IsEnum(AnimeStatus)
  @IsOptional()
  status?: AnimeStatus
  @IsEnum(AnimeRating)
  @IsOptional()
  rated?: AnimeRating
  @IsEnum(AnimeGenre, { each: true })
  @IsOptional()
  genre?: AnimeGenre[]
  @IsNumber()
  @IsPositive()
  @IsOptional()
  score?: number
  @IsString()
  @IsOptional()
  startDate?: string
  @IsString()
  @IsOptional()
  endDate?: string
  @IsBoolean()
  @IsOptional()
  genreExclude?: boolean
  @IsNumber()
  @IsOptional()
  limit?: number
  @IsEnum(AnimeOrderBy)
  @IsOptional()
  orderBy?: AnimeOrderBy
  @IsEnum(AnimeSort)
  @IsOptional()
  sort?: AnimeSort
  @IsNumber()
  @IsOptional()
  producer?: MalId
  @IsNumber()
  @IsOptional()
  magazine?: MalId
}

export class VideoQuery {
  @IsString()
  subUrl!: string
}

const queryParamToSearchQueryProp = cond<string, string>([
  [equals("title"), always("q")],
  [equals("startDate"), always("start_date")],
  [equals("endDate"), always("end_date")],
  [equals("genreExclude"), always("genre_exclude")],
  [equals("orderBy"), always("order_by")],
  [T, identity]
])
const queryParamsToSearchAnimeOptions = (queryParams: any) =>
  Object.keys(queryParams)
    .map(key => ({ source: key, target: queryParamToSearchQueryProp(key) }))
    .reduce(
      (acc: object, keys: any) => ({
        ...acc,
        [keys.target]: queryParams[keys.source]
      }),
      {}
    )

const router = Router()
  .get(
    "/video",
    arrayQueryParams([]),
    validateQuery(VideoQuery),
    async (req: ValidatedRequest<VideoQuery>, res) => {
      const { subUrl } = req.query
      const url = await getUrlOfAnimeEpisodeMemoized(subUrl)

      if (url == null) {
        res.status(404).end()
        return
      }

      proxy(req, { url }, res)
    }
  )
  .get("/episodes", async (req, res) => {
    const { title } = req.query
    const urls = await getEpisodeUrlsOfAnime(title)
    res.json(urls)
  })
  .get("/season", async (req, res) => {
    const { year, season } = req.query
    const animes = await getAnimesInSeason(year, season)
    res.json(animes)
  })
  .get(
    "/search",
    arrayQueryParams(["genre"]),
    validateQuery(SearchQuery),
    async (req, res) => {
      const options: SearchAnimeOptions = queryParamsToSearchAnimeOptions(
        req.query
      )
      const result = await searchAnime(options)
      res.json(result)
    }
  )
  .get("/releases", async (req, res) => {
    await refetchAnimeReleases()
    res.json(getCurrentAnimeReleases())
  })

export default router
