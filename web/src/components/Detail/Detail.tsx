import React, { useState, useEffect } from "react"
import { List, Typography } from "antd"
import { getEpisodes, createVideoUrl } from "../../services/animeService"

export default function Detail() {
  const [episodes, setEpisodes] = useState<string[]>([])
  const [url, setUrl] = useState("")

  useEffect(() => {
    getEpisodes("Vinland-Saga").then(setEpisodes)
  }, [])

  return (
    <div style={{ marginTop: "200px" }}>
      <List>
        {episodes.map((url, i) => (
          <List.Item key={i} onClick={() => setUrl(url)}>
            <Typography.Text style={{ color: "white" }}>
              Episode {i + 1}
            </Typography.Text>
          </List.Item>
        ))}
      </List>
      {url != "" && (
        <video controls>
          <source src={createVideoUrl(url)} type="video/mp4"></source>
        </video>
      )}
    </div>
  )
}
