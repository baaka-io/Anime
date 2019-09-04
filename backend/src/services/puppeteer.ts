import { Browser, Page, launch, Response } from "puppeteer"

let browser: Browser | null = null
let page: Page | null = null

const launchBrowser = () =>
  launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  })

type PageConsumer<T> = (page: Page) => Promise<T>

export const usePage = async <T>(
  consumer: PageConsumer<T>,
  allowedRequests?: string[]
) => {
  if (browser == null) browser = await launchBrowser()
  if (page == null) {
    page = await browser.newPage()
  }
  await setupPage(page, allowedRequests)
  return consumer(page)
}

const setupPage = async (
  page: Page,
  allowedRequest?: string[]
): Promise<Page> => {
  await page.setRequestInterception(true)
  const ignoredRequests = allowedRequest
    ? ["image", "stylesheet", "font", "script"].filter(
        x => !allowedRequest.includes(x)
      )
    : ["image", "stylesheet", "font", "script"]

  page.removeAllListeners("request")
  page.on("request", request => {
    if (ignoredRequests.indexOf(request.resourceType()) !== -1) {
      request.abort()
    } else {
      if (
        allowedRequest !== undefined ||
        request.headers()["sec-fetch-mode"] === "navigate"
      )
        request.continue()
      else request.abort()
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

export const goToUrl = async <T>(
  url: string,
  consumer: GoToUrlConsumer<T>,
  allowedRequests?: string[]
) =>
  usePage(async page => {
    await byPassCloudflare(page, page.goto(url))
    const result = consumer(page)
    return result
  }, allowedRequests)

export const byPassCloudflare = async (
  page: Page,
  p: Promise<Response | null>
) => {
  return p.then(res => {
    if (res && res.status() === 503) return page.waitForNavigation()
    return Promise.resolve(res)
  })
}
