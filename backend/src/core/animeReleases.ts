import { AnimeRelease } from "../entities/Anime";
import { getNewestAnimeEpisodes } from "../services/kissAnime";
import { Anime } from "../services/webSocket";

export const getAnimeReleasesDiff = (oldReleases: AnimeRelease[], newReleases: AnimeRelease[]): AnimeRelease[] => {
	if(oldReleases.length === 0 || newReleases.length === 0)
		return []
	const diff = []
	for(let i = 0; i < newReleases.length; i++){
        const isTheSameRelease = oldReleases[0].title === newReleases[i].title && oldReleases[0].info === newReleases[i].info
		if(isTheSameRelease)
			break;
		else diff.push(newReleases[i])
	}

	return diff
}

let currentAnimeReleases: AnimeRelease[] = []

export async function refetchAnimeReleases() {
    const releases = await getNewestAnimeEpisodes()
    const diff = getAnimeReleasesDiff(currentAnimeReleases, releases)
    diff.forEach(Anime.emitNewRelease)
    currentAnimeReleases = releases
}

export const getCurrentAnimeReleases = () => currentAnimeReleases