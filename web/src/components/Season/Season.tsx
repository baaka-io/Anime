import React, { useState, useEffect } from "react"
import AnimeCardGrid, { AnimeCardGridFilter } from "../common/AnimeCardGrid"
import { useCounter } from "react-use"
import { Anime, AnimeSeason, AnimeGenre } from "../../entities/Anime"
import { RouteComponentProps } from "react-router"
import slug from "slug"
import {
  enumToFilterSelectItems,
  generateFilterSelectItemsUntilYear
} from "../../util/animeFilter"
import { reverse, any } from "ramda"
import { searchBySeason } from "../../services/animeService"
import { dateToSeasonName } from "../../util/season"
import { unstable_batchedUpdates } from "react-dom"

const seasonItems = enumToFilterSelectItems(AnimeSeason, true)
const yearItems = reverse(
  generateFilterSelectItemsUntilYear(new Date().getFullYear(), true)
)

export type SeasonProps = {}
export default function Season(props: SeasonProps & RouteComponentProps) {
  const [page, pageControl] = useCounter(1)
  const [isLoading, setIsLoading] = useState(true)
  const [animes, setAnimes] = useState<Anime[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedSeason, setSelectedSeason] = useState(
    dateToSeasonName(new Date())
  )

  const filters: AnimeCardGridFilter[] = [
    {
      label: "Year",
      items: yearItems,
      defaultValue: selectedYear,
      onChange: setSelectedYear
    },
    {
      label: "Season",
      items: seasonItems,
      defaultValue: selectedSeason,
      onChange: setSelectedSeason
    }
  ]

  const goToDetailPage = (anime: Anime) => {
    props.history.push(
      "/detail?title=" + slug(anime.title.replace(";", " "), { symbols: false })
    )
  }

  useEffect(() => {
    const abortController = new AbortController()
    setIsLoading(true)
    searchBySeason(selectedYear, selectedSeason, abortController.signal).then(
      animes => {
        unstable_batchedUpdates(() => {
          setAnimes(animes.filter(anime => !anime.r18 && !anime.kids))
          setIsLoading(false)
        })
      }
    )
    return () => abortController.abort()
  }, [selectedYear, selectedSeason])

  return (
    <div style={{ padding: "150px" }}>
      <AnimeCardGrid
        hideNavigation={true}
        animes={animes}
        page={page}
        filters={filters}
        isLoading={isLoading}
        onGoBack={() => pageControl.dec(1)}
        onGoForward={() => pageControl.inc(1)}
        onAnimeCardClicked={goToDetailPage}></AnimeCardGrid>
    </div>
  )
}
