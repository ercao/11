export type PageType<T> = {
  page: number
  total: number
  size: number
  data: T
}

export type ResultType<T> = {
  msg: string
  code: number
  data?: T
}

export type UserType = {
  uuid: string
  username: string
  password: string
  nickname: string
  avatarUrl: string
  loginTime: number[]
  role: string
  status: string
}

export type ArtistType = {
  uuid: string
  name: string
  description: string
  pictureUrl: string
  user: string
  userEntity: UserType
  type: string
  area: string
  status: string
}

export type LyricType = {
  song: string
  content: string
}

export type SongType = {
  uuid: string
  name: string
  pictureUrl: string
  artists: string
  artistList: ArtistType[]
  album: string
  albumEntity: string
  url: string
  status: string
}

export type AlbumType = {
  uuid: string
  name: string
  description: string
  artists: string
  artistList: ArtistType[]
  pictureUrl: string
  publishTime: number
  status: string
}

export type PlaylistType = {
  uuid: string
  name: string
  description: string
  pictureUrl: string
  user: string
  userEntity: UserType
  songs: string
  songList: SongType[]
  tags: string
  updateTime: number[]
  createTime: number[]
}

export type PlaylistTagType = {
  name: string
}
