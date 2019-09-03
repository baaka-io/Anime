import React from "react"
import { Row, Button } from "antd"
import { useScroll } from "react-use"

export default function Navbar(props: any) {
  const { y } = useScroll(props.div)

  return (
    <Row
      style={{
        position: "fixed",
        width: "100vw",
        zIndex: 100,
        marginLeft: "300px",
        marginTop: 30 - y + "px"
      }}>
      <Button
        type="link"
        style={{
          color: "white",
          fontSize: "1.1em",
          borderBottom: "1px solid white",
          paddingBottom: "5px"
        }}>
        Discover
      </Button>
      <Button type="link" style={{ color: "#afafaf", fontSize: "1.1em" }}>
        Season
      </Button>
      <Button type="link" style={{ color: "#afafaf", fontSize: "1.1em" }}>
        Schedule
      </Button>
    </Row>
  )
}
