import { getAnimeReleasesDiff } from "./animeReleases";
import { AnimeRelease } from "../entities/Anime";

describe("getAnimeReleaseDiff", () => {
    test("returns the correct releases", () => {
        const generateReleases = (ns: number[]): AnimeRelease[] =>
            ns.map(i => ({
                title: "title" + i,
                info: "info" + i,
                isPreview: false,
                isMovie: false
            }))

        const oldReleases = generateReleases([1,2,3])
        const newReleases = generateReleases([4,5,1,2,3])
        const expected = generateReleases([4,5])
        const actual = getAnimeReleasesDiff(oldReleases, newReleases)
        expect(actual).toEqual(expected)
    })
})