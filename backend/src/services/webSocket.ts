import wss from "../wss"
import { AnimeRelease } from "../entities/Anime"

export const Anime = {
  emitNewRelease(release: AnimeRelease) {
    wss.emit("Anime/newRelease", release)
  }
}
