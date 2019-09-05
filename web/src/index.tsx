import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import store from "./store"
import App from "./components/App"
import "./global.scss"

if (process.env.NODE_ENV === "development") {
  document.title = "DEV - Baaka.io"
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
