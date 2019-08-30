import app from "./app"
import http from "http"
import { getUrlOfAnimeEpisode } from "./services/kissAnime"
import { getAnimesInCurrentSeason } from "./services/jikan"

const port = process.env.PORT || 8000
const server = http.createServer(app)

getAnimesInCurrentSeason().then(animes => {
	const anime = animes[0]
	getUrlOfAnimeEpisode(anime.title, 1).then(console.log)
}) 

server.listen(port, () => {
	console.log(`Listening on port ${port}.`)
})
