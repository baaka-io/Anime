import React, { PropsWithChildren, useState, useEffect, useRef } from "react"
import { Row, Col, Typography } from "antd"
import {
  AnimeStatus,
  AnimeType,
  Anime,
  AnimeRating,
  AnimeGenre
} from "../../entities/Anime"
import { enumToKeyValuePairs } from "../../util/enum"
import { reverse } from "ramda"
import * as AnimeService from "../../services/animeService"
import { unstable_batchedUpdates } from "react-dom"
import slug from "slug"
import { History } from "history"
import AnimeCardGrid from "../common/AnimeCardGrid"
import {
  generateFilterSelectItemsUntilYear,
  enumToFilterSelectItems,
  generateFilterSelectItemsFromRange
} from "../../util/animeFilter"

import "./AnimeFilter.scss"

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`

export type AnimeFilterProps = PropsWithChildren<{
  appRef: React.MutableRefObject<any>
  history: History
}>
export default function AnimeFilter(props: AnimeFilterProps) {
  const animeGridRef = useRef<any>(null)
  const yearItems = reverse(
    generateFilterSelectItemsUntilYear(new Date().getFullYear())
  )
  const statusItems = enumToFilterSelectItems(AnimeStatus)
  const ratingItems = enumToFilterSelectItems(AnimeRating)
  const typeItems = enumToFilterSelectItems(AnimeType)
  const scoreItems = reverse(generateFilterSelectItemsFromRange(1, 11))
  const genrePairs = enumToKeyValuePairs(AnimeGenre)

  const [selectedGenres, setSelectedGenres] = useState<{
    [key: number]: boolean
  }>({})
  const [page, setPage] = useState(1)
  const [isInitialFetch, setIsInitialFetch] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFromYear, setSelectedFromYear] = useState(null)
  const [selectedToYear, setSelectedToYear] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)
  const [selectedType, setSelectedType] = useState(AnimeType.Tv)
  const [selectedMinimumScore, setSelectedMinimumScore] = useState(null)
  const [animes, setAnimes] = useState<Anime>([])

  const filters = [
    {
      label: "From",
      items: yearItems,
      onChange: setSelectedFromYear
    },
    {
      label: "To",
      items: yearItems,
      onChange: setSelectedToYear
    },
    {
      label: "Status",
      items: statusItems,
      onChange: setSelectedStatus
    },
    {
      label: "Rating",
      items: ratingItems,
      onChange: setSelectedRating
    },
    {
      label: "Type",
      items: typeItems,
      onChange: setSelectedType
    },
    {
      label: "Min. Score",
      items: scoreItems,
      onChange: setSelectedMinimumScore
    }
  ]

  const goToDetailPage = (anime: Anime) => {
    props.history.push(
      "/detail?title=" + slug(anime.title.replace(";", " "), { symbols: false })
    )
  }

  useEffect(() => {
    if (!isInitialFetch && props.appRef && animeGridRef.current !== null) {
      props.appRef.current.scrollTo({
        top: 800,
        left: 0,
        behavior: "smooth"
      })
    }
  }, [page])

  useEffect(() => {
    const genres = Object.keys(selectedGenres).filter(
      (key: any) => selectedGenres[key]
    ) as any[]
    setIsLoading(true)
    if (isInitialFetch === true) setIsInitialFetch(false)
    const abortController = new AbortController()

    AnimeService.search(
      {
        score: selectedMinimumScore,
        status: selectedStatus,
        type: selectedType,
        rated: selectedRating,
        page,
        startDate:
          selectedFromYear && formatDate(new Date(selectedFromYear!, 1, 31)),
        genre: genres.length === 0 ? null : genres,
        endDate: selectedToYear && formatDate(new Date(selectedToYear!, 12, 31))
      },
      abortController.signal
    ).then(result => {
      unstable_batchedUpdates(() => {
        setAnimes(result.results)
        setIsLoading(false)
      })
    })

    return () => abortController.abort()
  }, [
    page,
    selectedGenres,
    selectedMinimumScore,
    selectedRating,
    selectedStatus,
    selectedType,
    selectedFromYear,
    selectedToYear
  ])

  return (
    <Row>
      <Col span={4}>
        <Row style={{ marginBottom: "35px" }}>
          <Typography.Text style={{ color: "white", fontSize: "1.1em" }}>
            Genres
          </Typography.Text>
        </Row>
        <Row>
          {genrePairs.map((pair, i) => (
            <Row
              key={i}
              onClick={() =>
                setSelectedGenres({
                  ...selectedGenres,
                  [pair.value as any]:
                    selectedGenres[pair.value as any] !== undefined
                      ? !selectedGenres[pair.value as any]
                      : true
                })
              }>
              <Typography.Text
                className="anime-filter_genre"
                style={{
                  color: selectedGenres[pair.value as any]
                    ? "white"
                    : "#afafaf",
                  fontWeight: selectedGenres[pair.value as any]
                    ? "bold"
                    : undefined,
                  lineHeight: "2.5"
                }}>
                {pair.key
                  .replace(/([A-Z][a-z])/g, " $1")
                  .replace(/(\d)/g, " $1")}
              </Typography.Text>
            </Row>
          ))}
        </Row>
      </Col>
      <Col span={20}>
        <AnimeCardGrid
          animes={animes}
          isLoading={isLoading}
          page={page}
          filters={filters}
          onGoBack={() => setPage(page - 1)}
          onGoForward={() => setPage(page + 1)}
          onAnimeCardClicked={goToDetailPage}></AnimeCardGrid>
      </Col>
    </Row>
  )
}
