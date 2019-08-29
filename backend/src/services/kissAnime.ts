import puppeteer from "puppeteer";
import slug from "slug"

let browser: puppeteer.Browser | null = null
let page: puppeteer.Page | null = null

const launchBrowser =  () => 
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

export const getUrlOfAnimeEpisode = async (title: string, episode: number): Promise<string | null> => {
	// if the title contains *nd season and it fails also try season *
	const slugifiedTitle = slug(title)
	const paddedEpisode = new String(episode).padStart(3, "0")
	const url = `https://kissanime.ru/Anime/${slugifiedTitle}/Episode-${paddedEpisode}?id=2&s=rapidvideo`
	return await goToUrl(url, async page => {
		const iframeHandle = await page.$("#my_video_1")
		if(iframeHandle != null){
			const iframe = await iframeHandle.contentFrame()
			if(iframe != null){
				return iframe.$eval('#videojs_html5_api', el => el.children[el.children.length - 1].getAttribute("src"))
			}
		}
		return Promise.reject("Something went wrong while parsing the html")
	})
}