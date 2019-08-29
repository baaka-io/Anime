import app from "./app"
import http from "http"

const port = process.env.PORT || 8000
const server = http.createServer(app)

server.listen(port, () => {
	console.log(`Listening on port ${port}.`)
})
