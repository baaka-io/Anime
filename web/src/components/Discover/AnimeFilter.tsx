import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
  Ref
} from "react"
import { Row, Col, Card, Typography, Rate, Spin, Pagination, Icon } from "antd"
import FilterSelect, { FilterSelectItem } from "../common/FilterSelect"
import {
  AnimeSeason,
  AnimeStatus,
  AnimeType,
  Anime,
  AnimeRating,
  AnimeGenre
} from "../../entities/Anime"
import { enumToKeyValuePairs } from "../../util/enum"
import {
  range,
  reverse,
  append,
  pipe,
  map,
  prepend,
  cond,
  equals,
  always,
  T
} from "ramda"

import "./AnimeFilter.scss"
import * as AnimeService from "../../services/animeService"
import { unstable_batchedUpdates } from "react-dom"

const allOption = { text: "All", value: null }

const generateFilterSelectItemsFromRange = (from: number, to: number) =>
  pipe(
    () => range(from, to),
    map<number, FilterSelectItem>(year => ({
      text: year.toString(),
      value: year
    })),
    append(allOption)
  )()

const generateFilterSelectItemsUntilYear = (year: number) =>
  generateFilterSelectItemsFromRange(2002, year + 1)

const enumToFilterSelectItems = (inum: any) =>
  prepend<FilterSelectItem>(
    allOption,
    enumToKeyValuePairs(inum).map(pair => ({
      text: pair.key,
      value: pair.value
    }))
  )

const seasonToMonthRange: (
  season: AnimeSeason | null
) => [number, number] = cond<any, [number, number]>([
  [equals(AnimeSeason.Winter), always([12, 2])],
  [equals(AnimeSeason.Spring), always([3, 5])],
  [equals(AnimeSeason.Summer), always([6, 8])],
  [equals(AnimeSeason.Fall), always([9, 11])],
  [T, always([0, 11])]
])

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`

const AnimeCard: React.FC<{
  title: string
  image: string
  score: number
}> = props => (
  <Col span={4} className="anime-filter_anime-card">
    <Row>
      <img src={props.image} width="200px" height="300px"></img>
    </Row>
    <Row>
      <Typography.Text>{props.title}</Typography.Text>
    </Row>
  </Col>
)

let isInitialFetch = true

export type AnimeFilterProps = PropsWithChildren<{
  appRef: React.MutableRefObject<any>
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
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFromYear, setSelectedFromYear] = useState(null)
  const [selectedToYear, setSelectedToYear] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)
  const [selectedType, setSelectedType] = useState(AnimeType.Tv)
  const [selectedMinimumScore, setSelectedMinimumScore] = useState(null)
  const [animes, setAnimes] = useState<Anime>([])

  useEffect(() => {
    if (!isInitialFetch && animeGridRef.current !== null) {
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
    if (isInitialFetch === true) isInitialFetch = false
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
        <Row type="flex" justify="center" style={{ marginBottom: "30px" }}>
          <Col span={4}>
            <FilterSelect
              label="From"
              items={yearItems}
              onChange={setSelectedFromYear}></FilterSelect>
          </Col>
          <Col span={4}>
            <FilterSelect
              label="To"
              items={yearItems}
              onChange={setSelectedToYear}></FilterSelect>
          </Col>
          <Col span={4}>
            <FilterSelect
              label="Status"
              items={statusItems}
              onChange={setSelectedStatus}></FilterSelect>
          </Col>
          <Col span={4}>
            <FilterSelect
              label="Rating"
              items={ratingItems}
              onChange={setSelectedRating}></FilterSelect>
          </Col>
          <Col span={4}>
            <FilterSelect
              label="Type"
              defaultValue={AnimeType.Tv}
              items={typeItems}
              onChange={setSelectedType}></FilterSelect>
          </Col>
          <Col span={4}>
            <FilterSelect
              label="Min. Score"
              items={scoreItems}
              onChange={setSelectedMinimumScore}></FilterSelect>
          </Col>
        </Row>
        <Row>
          {isLoading && (
            <div className="anime-filter_anime-grid-loading">
              <Spin></Spin>
            </div>
          )}
          {!isLoading && (
            <div ref={animeGridRef} className="anime-filter_anime-card-grid">
              {animes.map((anime: any, i: number) => (
                <AnimeCard
                  key={i}
                  score={anime.score}
                  title={anime.title}
                  image={anime.image_url}></AnimeCard>
              ))}
            </div>
          )}
        </Row>
        <Row style={{ marginTop: "10px" }}>
          {!isLoading && animes.length !== 0 && (
            <React.Fragment>
              <Col span={11}>
                <span
                  style={{
                    cursor: "pointer",
                    display: page == 1 ? "none" : "inline"
                  }}
                  onClick={() => setPage(page - 1)}>
                  <Icon
                    type="arrow-left"
                    style={{
                      fontSize: ".9em"
                    }}></Icon>
                  <Typography.Text
                    style={{
                      marginLeft: "10px",
                      color: "white",
                      fontSize: "1.1em"
                    }}>
                    Previous
                  </Typography.Text>
                </span>
              </Col>
              <Col span={2}>
                <span
                  style={{
                    fontSize: "1.2em",
                    color: "white",
                    display: "block",
                    textAlign: "center"
                  }}>
                  {page}
                </span>
              </Col>
              <Col
                span={11}
                style={{
                  textAlign: "right",
                  display: animes.length === 0 ? "none" : "inline"
                }}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setPage(page + 1)}>
                  <Typography.Text
                    style={{
                      marginRight: "10px",
                      color: "white",
                      fontSize: "1.1em"
                    }}>
                    Next
                  </Typography.Text>
                  <Icon type="arrow-right" style={{ fontSize: ".9em" }}></Icon>
                </span>
              </Col>
            </React.Fragment>
          )}
        </Row>
      </Col>
    </Row>
  )
}
