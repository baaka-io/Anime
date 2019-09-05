import React from "react"
import { Row, Col, Spin, Icon, Typography } from "antd"
import FilterSelect, { FilterSelectItem } from "./FilterSelect"
import { Anime } from "../../entities/Anime"
import AnimeCard from "./AnimeCard"

import "./AnimeCardGrid.scss"

const PreviousButton: React.FC<{ onClick: () => void }> = props => (
  <span style={{ cursor: "pointer" }} onClick={props.onClick}>
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
)

const NextButton: React.FC<{ onClick: () => void }> = props => (
  <span style={{ cursor: "pointer" }} onClick={props.onClick}>
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
)

export type AnimeCardGridFilter = {
  label: string
  items: FilterSelectItem[]
  defaultValue: any
  onChange: (option: any) => void
}
export type AnimeCardGridProps = {
  isLoading: boolean
  animes: Anime[]
  filters: AnimeCardGridFilter[]
  page: number
  hideNavigation?: boolean
  onAnimeCardClicked: (anime: Anime) => void
  onGoBack: () => void
  onGoForward: () => void
}
export default function AnimeCardGrid(props: AnimeCardGridProps) {
  return (
    <div>
      <Row className="anime-card-grid_filters">
        {props.filters.map(filter => (
          <Col span={4} key={filter.label}>
            <FilterSelect {...filter}></FilterSelect>
          </Col>
        ))}
      </Row>
      <Row>
        {props.isLoading ? (
          <div className="anime-card-grid_loading">
            <Spin></Spin>
          </div>
        ) : (
          <div className="anime-card-grid">
            {props.animes.map((anime: any, i: number) => (
              <AnimeCard
                onClick={() => props.onAnimeCardClicked(anime)}
                key={i}
                score={anime.score}
                title={anime.title}
                image={anime.image_url}></AnimeCard>
            ))}
          </div>
        )}
      </Row>
      {!props.hideNavigation && (
        <Row style={{ marginTop: "10px" }}>
          {!props.isLoading && props.animes.length !== 0 && (
            <React.Fragment>
              <Col
                span={11}
                style={{
                  visibility:
                    props.animes.length === 0 || props.page === 1
                      ? "hidden"
                      : "visible"
                }}>
                <PreviousButton onClick={props.onGoBack}></PreviousButton>
              </Col>
              <Col span={2}>
                <span
                  style={{
                    fontSize: "1.2em",
                    color: "white",
                    display: "block",
                    textAlign: "center"
                  }}>
                  {props.page}
                </span>
              </Col>
              <Col
                span={11}
                style={{
                  textAlign: "right",
                  display: props.animes.length === 0 ? "none" : "inline"
                }}>
                <NextButton onClick={props.onGoForward}></NextButton>
              </Col>
            </React.Fragment>
          )}
        </Row>
      )}
    </div>
  )
}
