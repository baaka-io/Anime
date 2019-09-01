import { Browser, Page, launch } from "puppeteer"

let browser: Browser | null = null
let page: Page | null = null

const launchBrowser = () => 
	launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
	})

type PageConsumer<T> = (page: Page) => Promise<T>

export const usePage = async <T>(consumer: PageConsumer<T>) => {
	if(browser == null)
		browser = await launchBrowser()
	if(page == null)
		page = await browser.newPage()
	return consumer(page)
}

type GoToUrlConsumer<T> = (page: Page) => Promise<T>

export const goToUrl = async <T>(url: string, consumer: GoToUrlConsumer<T>) =>
	usePage(async (page) => {
		const response = await page.goto(url)
		if(response && response.status() === 503)
			await page.waitForNavigation()
		return consumer(page)
	})