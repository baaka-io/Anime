import React from "react"
import { Col, Typography, Row } from "antd"

import "./AnimeCard.scss"

export type AnimeCardProps = {
  title: string
  onClick: () => void
  image: string
  score: number
}
export default function AnimeCard(props: AnimeCardProps) {
  return (
    <Col span={4} className="anime-card">
      <Row>
        <img
          src={props.image}
          width="200px"
          height="300px"
          onClick={props.onClick}></img>
      </Row>
      <Row>
        <Typography.Text>{props.title}</Typography.Text>
      </Row>
    </Col>
  )
}
