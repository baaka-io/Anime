import express from "express"
import healthCheck from "./routes/healthCheck"

const app = express()

app.use("/healthCheck", healthCheck)

export default app
