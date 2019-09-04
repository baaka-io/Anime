import { Page } from "puppeteer"
import { goToUrl, useNewPage, byPassCloudflare } from "./puppeteer"
import { AnimeRelease } from "../entities/Anime"

export async function initKissAnimeService() {
  return goToUrl("https://kissanime.ru", () => Promise.resolve(null))
}

const getVideoUrlOfPage = async (page: Page): Promise<string | null> => {
  const iframeHandle = await page.$("#my_video_1")
  if (iframeHandle != null) {
    const iframe = await iframeHandle.contentFrame()
    if (iframe != null) {
      return iframe.$eval("#videojs_html5_api", el =>
        el.children[el.children.length - 1].getAttribute("src")
      )
    }
  }
  return null
}

const createEpisodeUrl = (subUrl: string): string =>
  `https://kissanime.ru/Anime/${subUrl}&s=rapidvideo`

const createAnimeUrl = (title: string): string =>
  `https://kissanime.ru/Anime/${title}`

export const getUrlOfAnimeEpisode = async (
  subUrl: string
): Promise<string | null> => {
  return goToUrl(createEpisodeUrl(subUrl), getVideoUrlOfPage, ["script"])
}

export const getEpisodeUrlsOfAnime = async (title: string) => {
  const animeUrl = createAnimeUrl(title)
  return goToUrl(animeUrl, async page => {
    return await page.evaluate(() =>
      Array.from(document.querySelectorAll("table.listing tbody tr td a")).map(
        (link: Element) => link.getAttribute("href")!.replace("/Anime/", "")
      )
    )
  })
}

export const getNewestAnimeEpisodes = async (): Promise<AnimeRelease[]> =>
  useNewPage(async (page: Page) => {
    await byPassCloudflare(page, page.goto("https://kissanime.ru"))
    const releases = await page.$$eval(
      ".barContent .scrollable .items div a",
      as =>
        as.map(a => ({
          title: (a.getAttribute("href") as string).replace("Anime/", ""),
          info: a.getAttribute("title") as string
        }))
    )
    return releases.map(release => {
      if (release.info.includes("Movie")) {
        return {
          title: release.title,
          info: "Movie",
          isMovie: true,
          isPreview: false
        }
      } else if (release.info.includes("Preview")) {
        return {
          title: release.title,
          info: "Preview",
          isMovie: false,
          isPreview: true
        }
      } else {
        return {
          title: release.title,
          info: release.info,
          isMovie: false,
          isPreview: true
        }
      }
    })
  })
