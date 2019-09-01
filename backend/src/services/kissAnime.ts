import { Page } from "puppeteer";
import { insert } from "ramda"
import { goToUrl } from "./puppeteer"

export async function byPassCloudflare(){
	return goToUrl("https://kissanime.ru", () => Promise.resolve(null))
}

const getVideoUrlOfPage = async (page: Page): Promise<string | null> => {
	const iframeHandle = await page.$("#my_video_1")
	if(iframeHandle != null){
		const iframe = await iframeHandle.contentFrame()
		if(iframe != null){
			return iframe.$eval('#videojs_html5_api', el => el.children[el.children.length - 1].getAttribute("src"))
		}
	}
	return null
}

const createEpisodeUrl = (title: string, episode: number): string =>
	`https://kissanime.ru/Anime/${title}/Episode-${new String(episode).padStart(3, "0")}?id=2&s=rapidvideo`

const getVideoUrlOfAnimeEpisode = (title: string, episode: number): Promise<string | null> =>
	goToUrl(createEpisodeUrl(title, episode), getVideoUrlOfPage)

export const getUrlOfAnimeEpisode = async (title: string, episode: number): Promise<string | null> => {
	const videoUrl = await getVideoUrlOfAnimeEpisode(title, episode)
	if(videoUrl == null && title.includes("2nd-Season")){
		const titleTokens = title.replace("nd-Season", "").split("-")
		const alternativeTitle = insert(titleTokens.length - 1, "Season", titleTokens).join("-")
		return getVideoUrlOfAnimeEpisode(alternativeTitle, episode)
	}
	else return videoUrl
}

export const getNewestAnimeEpisodes = async (): Promise<any> => 
	goToUrl("https://kissanime.ru", async (page: Page) => {
		const releases = await page.$$eval(".barContent .scrollable .items div a", as => as.map(a => ({
			title: (a.getAttribute("href") as string).replace("Anime/", ""),
			info: (a.getAttribute("title") as string)
		})))
		return releases
			.map(release => {
				if(release.info.includes("Movie")){
					return {
						title: release.title,
						info: "Movie",
						isMovie: true,
						isPreview: false
					}
				}
				else if(release.info.includes("Preview")){
					return {
						title: release.title,
						info: "Preview",
						isMovie: false,
						isPreview: true
					}
				}
				else {
					return {
						title: release.title,
						info: release.info,
						isMovie: false,
						isPreview: true
					}
				}
			})
	})


getNewestAnimeEpisodes().then(console.log)