import { cond, always } from "ramda"
import { AnimeSeason } from "../entities/Anime"

const between = (x: number, y: number) => (z: number) => x >= z && x <= y

export const dateToSeasonName = (date: Date) =>
  cond<number, AnimeSeason>([
    [between(1, 3), always(AnimeSeason.Winter)],
    [between(4, 6), always(AnimeSeason.Spring)],
    [between(7, 9), always(AnimeSeason.Summer)],
    [between(10, 12), always(AnimeSeason.Fall)]
  ])(date.getMonth() + 1)
