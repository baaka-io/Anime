import { hot } from "react-hot-loader"
import React, { useRef } from "react"
import Discover from "./Discover/Discover"
import Detail from "./Detail/Detail"
import Navbar from "./Navbar"

import "./App.scss"

export default hot(module)(function App() {
  const ref = useRef(null)
  return (
    <div className="App" ref={ref}>
      <Navbar div={ref}></Navbar>
      <Detail></Detail>
    </div>
  )
})
