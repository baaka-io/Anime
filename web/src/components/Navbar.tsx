import React from "react"
import { Row, Button } from "antd"
import { useScroll } from "react-use"
import { NavLink } from "react-router-dom"

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
      <NavLink
        to="/"
        exact
        activeStyle={{
          borderBottom: "1px solid white",
          paddingBottom: "5px",
          color: "white"
        }}
        style={{
          color: "#afafaf",
          marginRight: "20px",
          fontSize: "1.1em"
        }}>
        Discover
      </NavLink>
      <NavLink
        to="/season"
        activeStyle={{
          borderBottom: "1px solid white",
          paddingBottom: "5px",
          color: "white"
        }}
        style={{
          color: "#afafaf",
          marginRight: "20px",
          fontSize: "1.1em"
        }}>
        Season
      </NavLink>
      <NavLink
        to="/schedule"
        activeStyle={{
          borderBottom: "1px solid white",
          paddingBottom: "5px",
          color: "white"
        }}
        style={{
          color: "#afafaf",
          marginRight: "20px",
          fontSize: "1.1em"
        }}>
        Schedule
      </NavLink>
    </Row>
  )
}
