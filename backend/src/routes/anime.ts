import { Router } from "express"
import { getUrlOfAnimeEpisode } from "../services/kissAnime";
import { memoizeWith } from "ramda";
//@ts-ignore
import proxy from "http-proxy-stream"

const getUrlOfAnimeEpisodeMemoized = memoizeWith((title, episode) => title + episode, getUrlOfAnimeEpisode)

const router = Router()
	.get("/video", async (req, res) => {
        const { title, episode } = req.query
        const url = await getUrlOfAnimeEpisodeMemoized(title, episode)

        if(url == null){
            res.status(404).end();
            return;
        }

        proxy(req, { url }, res)
	})

export default router

