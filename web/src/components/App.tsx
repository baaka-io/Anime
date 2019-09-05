import { hot } from "react-hot-loader"
import React, { useRef } from "react"
import Discover from "./Discover/Discover"
import Detail from "./Detail/Detail"
import Navbar from "./Navbar"
import { BrowserRouter as Router, Route } from "react-router-dom"

import "./App.scss"
import Season from "./Season/Season"

export default hot(module)(function App() {
  const ref = useRef(null)

  return (
    <div className="App" ref={ref}>
      <Router>
        <Navbar div={ref}></Navbar>
        <Route
          path="/"
          exact
          render={(props: any) => (
            <Discover {...props} appRef={ref}></Discover>
          )}></Route>
        <Route path="/detail" exact component={Detail}></Route>
        <Route path="/season" exact component={Season}></Route>
      </Router>
    </div>
  )
})
