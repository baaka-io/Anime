import express from "express"
/* Middlewares */
import morgan from "morgan"
/* Routes */
import healthCheck from "./routes/healthCheck"

const app = express()

app.use(morgan("dev", {immediate: true}))

app.use("/healthCheck", healthCheck)

export default app
