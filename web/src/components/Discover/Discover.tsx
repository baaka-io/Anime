import React, { Ref } from "react"
import { Row, Col, Typography, Button, Icon, Rate } from "antd"
import AnimeFilter from "./AnimeFilter"

import "./Discover.scss"

export default function Discover(props: {
  appRef: React.MutableRefObject<any>
}) {
  return (
    <div>
      <Row style={{ height: "85vh", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            paddingTop: "180px",
            paddingLeft: "150px",
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0)), url(https://images.wallpapersden.com/image/download/thorfinn-in-vinland-saga_66221_1920x1080.jpg)"
          }}>
          <Row>
            <Col span={7}>
              <Typography.Title
                style={{
                  color: "white",
                  fontSize: "4em",
                  fontWeight: "bold",
                  paddingBottom: "10px"
                }}>
                Vinland Saga
              </Typography.Title>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Typography.Text
                style={{
                  color: "#a3a3a3",
                  lineHeight: "1.5",
                  fontSize: "1.1em"
                }}>
                For a thousand years, the Vikings have made quite a name and
                reputation for themselves as the strongest families with a
                thirst for violence. Thorfinn, the son of one of the Vikings'
                greatest warriors, spends his boyhood in a battlefield enhancing
                his skills in his adventure to redeem his most-desired revenge
                after his father was murdered.
              </Typography.Text>
            </Col>
          </Row>
          <Row>
            <Button
              ghost
              shape="round"
              style={{
                marginTop: "80px",
                padding: "0 20px",
                width: "300px",
                paddingBottom: "35px",
                paddingTop: "10px"
              }}>
              MORE DETAILS <Icon type="arrow-right"></Icon>
            </Button>
          </Row>
          <Row style={{ marginTop: "150px" }}>
            <Col span={4}>
              <Row>
                <Typography.Text
                  style={{
                    fontSize: "1.3em",
                    color: "white"
                  }}>
                  Score
                </Typography.Text>
              </Row>
              <Row>
                <Rate allowHalf disabled defaultValue={4.25}></Rate>
              </Row>
            </Col>
            <Col span={4}>
              <Row>
                <Typography.Text
                  style={{
                    fontSize: "1.3em",
                    color: "white"
                  }}>
                  Studios
                </Typography.Text>
              </Row>
              <Row style={{ marginTop: "5px" }}>
                <Typography.Text
                  style={{
                    fontSize: "1.1em",
                    color: "#afafaf"
                  }}>
                  Wit Studios
                </Typography.Text>
              </Row>
            </Col>
            <Col span={4}>
              <Row>
                <Typography.Text
                  style={{
                    fontSize: "1.3em",
                    color: "white"
                  }}>
                  Genres
                </Typography.Text>
              </Row>
              <Row style={{ marginTop: "5px" }}>
                <Typography.Text
                  style={{
                    fontSize: "1.1em",
                    color: "#afafaf"
                  }}>
                  Action, Adventure, Historical, Drama, Seinen
                </Typography.Text>
              </Row>
            </Col>
          </Row>
        </div>
      </Row>
      <Row style={{ padding: "40px 150px" }}>
        <AnimeFilter appRef={props.appRef}></AnimeFilter>
      </Row>
    </div>
  )
}
