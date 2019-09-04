import { Browser, Page, launch, Response } from "puppeteer"

let browser: Browser | null = null
let page: Page | null = null

const launchBrowser = () =>
  launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  })

type PageConsumer<T> = (page: Page) => Promise<T>

export const usePage = async <T>(consumer: PageConsumer<T>) => {
  if (browser == null) browser = await launchBrowser()
  if (page == null) {
    page = await setupPage(await browser.newPage())
  }
  return consumer(page)
}

const setupPage = async (page: Page): Promise<Page> => {
  await page.setRequestInterception(true)
  page.on("request", request => {
    if (
      ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
    ) {
      request.abort()
    } else {
      request.continue()
    }
  })
  return page
}

export const useNewPage = async <T>(consumer: PageConsumer<T>) => {
  if (browser == null) browser = await launchBrowser()
  const page = await setupPage(await browser.newPage())
  const result = await consumer(page)
  await page.close()
  return result
}

type GoToUrlConsumer<T> = (page: Page) => Promise<T>

export const goToUrl = async <T>(url: string, consumer: GoToUrlConsumer<T>) =>
  usePage(async page => {
    const before = Date.now()
    await byPassCloudflare(page, page.goto(url))
    const result = consumer(page)
    result.then(() => {
      const after = Date.now()
      console.log(`It took ${(after - before) / 1000} seconds`)
    })
    return result
  })

export const byPassCloudflare = async (
  page: Page,
  p: Promise<Response | null>
) => {
  return p.then(res => {
    if (res && res.status() === 503) return page.waitForNavigation()
    return Promise.resolve(res)
  })
}
