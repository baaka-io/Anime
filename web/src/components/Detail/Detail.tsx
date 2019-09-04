import React, { useState, useEffect } from "react"
import { List, Typography, Select } from "antd"
import { getEpisodes, createVideoUrl } from "../../services/animeService"
import { RouteComponentProps } from "react-router"
import { reverse } from "ramda"
import FilterSelect, { FilterSelectItem } from "../common/FilterSelect"
import { unstable_batchedUpdates } from "react-dom"

export default function Detail(props: RouteComponentProps) {
  const params = new URLSearchParams(props.location.search)
  const title = params.get("title")
  const [episodes, setEpisodes] = useState<string[]>([])
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (title)
      getEpisodes(title).then(x => {
        unstable_batchedUpdates(() => {
          const temp = reverse<string>(x.sort())
          setEpisodes(temp)
          setUrl(temp[0])
        })
      })
    else props.history.goBack()
  }, [])

  const episodeSelectItems: FilterSelectItem[] = episodes.map((url: string) => {
    return {
      text: url.split("Episode-")[1].split("?")[0],
      value: url
    }
  })

  return (
    <div
      style={{
        marginTop: "200px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}>
      <FilterSelect
        label="Episode"
        onChange={setUrl}
        items={episodeSelectItems}></FilterSelect>
      <video style={{ width: "1280px", height: "720px" }} controls key={url}>
        {url != "" && (
          <source src={createVideoUrl(url)} type="video/mp4"></source>
        )}
      </video>
    </div>
  )
}
