import app from "./app"
import { initWSS } from "./wss"
import http from "http"
import { initKissAnimeService } from "./services/kissAnime";
import { refetchAnimeReleases } from "./core/animeReleases";

const port = process.env.PORT || 8000
const server = http.createServer(app)

const main = async () => {
	initWSS(server)
	await initKissAnimeService()
	setInterval(refetchAnimeReleases, 10 * 60 * 1000)
	server.listen(port, () => {
		console.log(`Listening on port ${port}.`)
	})
}

main()