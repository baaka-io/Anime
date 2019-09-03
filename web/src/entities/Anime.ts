export type MalId = number
export type Anime = any
export type AnimeRelease = {
  title: string
  info: string
  isMovie: boolean
  isPreview: boolean
}
export enum AnimeOrderBy {
  Title = "title",
  StartDate = "start_date",
  EndDate = "end_date",
  Score = "score",
  Type = "type",
  Members = "members",
  Id = "id",
  Episodes = "episodes",
  Rating = "rating"
}
export enum AnimeSort {
  Descending = "descending",
  Ascending = "ascending"
}
export enum AnimeStatus {
  Airing = "airing",
  Completed = "completed",
  Upcoming = "upcoming"
}
export enum AnimeRating {
  G = "g",
  Pg = "pg",
  Pg13 = "pg13",
  R17 = "r17",
  R = "r",
  Rx = "rx"
}
export enum AnimeType {
  Tv = "tv",
  Ova = "ova",
  Movie = "movie",
  Special = "special",
  Ona = "ona",
  Music = "music"
}
export enum AnimeSeason {
  Summer = "summer",
  Spring = "spring",
  Fall = "fall",
  Winter = "winter"
}
export enum AnimeGenre {
  Action = 1,
  Adventure,
  Cars,
  Comedy,
  Dementia,
  Demons,
  Mystery,
  Drama,
  Ecchi,
  Fantasy,
  Game,
  Hentai,
  Historical,
  Horror,
  Kids,
  Magic,
  MartialArts,
  Mecha,
  Music,
  Parody,
  Samurai,
  Romance,
  School,
  SciFi,
  Shoujo,
  ShoujoAi,
  Shounen,
  ShounenAi,
  Space,
  Sports,
  SuperPower,
  Vampire,
  Yaoi,
  Yuri,
  Harem,
  SliceOfLife,
  Supernatural,
  Military,
  Police,
  Psychological,
  Thriller,
  Seinen,
  Josei
}
