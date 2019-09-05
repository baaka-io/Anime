import React, { useState, useEffect, useRef } from "react"
import { getEpisodes, createVideoUrl } from "../../services/animeService"
import { RouteComponentProps } from "react-router"
import { reverse } from "ramda"
import FilterSelect, { FilterSelectItem } from "../common/FilterSelect"
import { unstable_batchedUpdates } from "react-dom"

import "./Detail.scss"

export default function Detail(props: RouteComponentProps) {
  const params = new URLSearchParams(props.location.search)
  const title = params.get("title")

  const videoRef = useRef<HTMLVideoElement>(null)

  const [episodes, setEpisodes] = useState<string[] | null>([])
  const [url, setUrl] = useState("")

  useEffect(() => {
    const abortController = new AbortController()
    if (title)
      getEpisodes(title, abortController.signal).then(x => {
        unstable_batchedUpdates(() => {
          const temp = reverse<string>(
            x.filter((y: string) => y.includes("Episode")).sort()
          )
          setEpisodes(temp.length == 0 ? null : temp)
          setUrl(temp[0])
        })
      })
    else props.history.goBack()
    return () => abortController.abort()
  }, [])

  const episodeSelectItems: FilterSelectItem[] | null =
    episodes &&
    episodes.map((url: string) => {
      return {
        text: url.split("Episode-")[1].split("?")[0],
        value: url
      }
    })

  return (
    <div className="detail">
      <div className="detail_video-section">
        {episodes && episodes.length > 0 ? (
          <React.Fragment>
            <div className="detail_episode-selector">
              <FilterSelect
                label="Episode"
                onChange={setUrl}
                items={episodeSelectItems || []}></FilterSelect>
            </div>
            <video ref={videoRef} className="detail_video" controls key={url}>
              {url != "" && (
                <source src={createVideoUrl(url)} type="video/mp4"></source>
              )}
            </video>
          </React.Fragment>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
