import app from "./app"
import * as http from "http"

const port = process.env.PORT || 8000
const server = http.createServer(app)

server.listen(port, () => {
	console.log(`Listening on port ${port}.`)
})
