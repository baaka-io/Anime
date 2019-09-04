import React, { useState, useEffect } from "react"
import { List, Typography } from "antd"
import { getEpisodes, createVideoUrl } from "../../services/animeService"
import { RouteComponentProps } from "react-router"

export default function Detail(props: RouteComponentProps) {
  const params = new URLSearchParams(props.location.search)
  const title = params.get("title")
  const [episodes, setEpisodes] = useState<string[]>([])
  const [url, setUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")

  useEffect(() => {
    if (url != "") setVideoUrl(createVideoUrl(url))
  }, [url])

  useEffect(() => {
    if (title) getEpisodes(title).then(setEpisodes)
    else props.history.goBack()
  }, [])

  return (
    <div style={{ marginTop: "200px" }}>
      <List>
        {episodes.map((url, i) => (
          <List.Item key={i} onClick={() => setUrl(url)}>
            <Typography.Text style={{ color: "white", cursor: "pointer" }}>
              Episode {episodes.length - i}
            </Typography.Text>
          </List.Item>
        ))}
      </List>
      {videoUrl != "" && (
        <video controls key={url}>
          <source src={videoUrl} type="video/mp4"></source>
        </video>
      )}
    </div>
  )
}
