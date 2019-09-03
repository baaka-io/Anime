import express from "express"
/* Middlewares */
import morgan from "morgan"
import cors from "cors"
/* Routes */
import healthCheck from "./routes/healthCheck"
import anime from "./routes/anime"

const app = express()

app.use(
  cors({
    allowedHeaders: "*",
    origin: "*",
    methods: "*"
  })
)
app.use(morgan("dev"))

app.use("/healthCheck", healthCheck)
app.use("/anime", anime)

export default app
