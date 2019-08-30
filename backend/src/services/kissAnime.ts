import puppeteer, { Page } from "puppeteer";
import { insert, tap } from "ramda"
import slug from "slug"

let browser: puppeteer.Browser | null = null
let page: puppeteer.Page | null = null

const launchBrowser = () => 
	puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
	})

type PageConsumer = (page: puppeteer.Page, isNewPage: boolean) => Promise<string | null>

const usePage = async (consumer: PageConsumer): ReturnType<PageConsumer> => {
	let isNewPage = false
	if(browser == null)
		browser = await launchBrowser()
	if(page == null){
		isNewPage = true
		page = await browser.newPage()
	}
	return consumer(page, isNewPage)
}

type GoToUrlConsumer = (page: puppeteer.Page) => Promise<string | null>

const goToUrl = async (url: string, consumer: GoToUrlConsumer): ReturnType<GoToUrlConsumer> =>
	usePage(async (page, isNewPage) => {
		await page.goto(url)
		if(isNewPage)
			await page.waitForNavigation()
		return consumer(page)
	})

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
	goToUrl(createEpisodeUrl(slug(title), episode), getVideoUrlOfPage)

export const getUrlOfAnimeEpisode = async (title: string, episode: number): Promise<string | null> => {
	const videoUrl = await getVideoUrlOfAnimeEpisode(title, episode)
	if(videoUrl == null && title.includes("2nd Season")){
		const titleTokens = title.replace("nd Season", "").split(" ")
		const alternativeTitle = insert(titleTokens.length - 1, "Season", titleTokens).join(" ")
		return getVideoUrlOfAnimeEpisode(alternativeTitle, episode)
	}
	else return videoUrl
}