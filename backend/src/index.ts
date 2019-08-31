import app from "./app"
import http from "http"
import { byPassCloudflare } from "./services/kissAnime";

const port = process.env.PORT || 8000
const server = http.createServer(app)

const main = async () => {
	await byPassCloudflare()
	server.listen(port, () => {
		console.log(`Listening on port ${port}.`)
	})
}

main()