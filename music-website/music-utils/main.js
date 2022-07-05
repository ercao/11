import pkg from 'NeteaseCloudMusicApi'
import { v4 } from 'uuid'
import * as fs from 'fs'
import { format } from 'date-fns'

const {
  lyric,
  playlist_catlist,
  top_playlist,
  playlist_track_all,
  artist_detail,
  album,
  user_detail,
} = pkg

/**
 * 生成固定长度随机字符串
 */
function randomString(length = 16) {
  const CHARS = '123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'
  let str = ''
  for (let i = 0; i < length; ++i) {
    const index = Math.floor(Math.random() * CHARS.length)
    str += CHARS[index]
  }
  return str
}

/**
 * 转移字符串
 * @param str
 * @returns {*}
 */
function escapeString(str) {
  return str === null || str === undefined
    ? str
    : str.replace(/(?<!\\)'/g, "\\'")
}

async function getPlaylistTagMap() {
  /**
   * 获取所有分类
   */
  console.log('处理歌单分类---begin----')
  const result = await playlist_catlist({})

  const tagSet = new Set(result.body.sub.map((tag) => escapeString(tag.name)))
  console.log('歌单分类数量：', tagSet.size)
  console.log('处理歌单分类---end----')
  return tagSet
}

/**
 * 获取歌单
 * @returns {Promise<Map<any, any>>}
 */
async function getPlaylistMap(size = 999999, cat = '全部') {
  console.log('处理歌单---begin----')
  const playlistMap = new Map()

  const result = await top_playlist({ cat })
  size = Math.min(result.body.total, size)

  // 分段处理
  await (async function step(offset, limit, size) {
    console.log(
      `------------分段处理[`,
      Math.floor(offset / limit) + 1,
      '/',
      Math.ceil(size / limit),
      `]-------`
    )
    let nu = 0
    const result = await top_playlist({ limit, offset, cat })
    // result = await top_playlist({ limit: result.body.total })
    // result = await top_playlist({limit: result.body.})
    const playlists = result.body.playlists

    for (const playlist of playlists) {
      const id = playlist.id
      console.log('----正在处理歌单[', ++nu, '/', limit, ']：', id)
      const result = await playlist_track_all({ id })
      let songs = []
      if (result.body.songs != null) {
        songs = result.body.songs
          .filter((song) => song.copyright === 1)
          .map((song) => song.id)
      }

      playlistMap.set(id, {
        uuid: v4(),
        id: playlist.id,
        name: escapeString(playlist.name),
        description: escapeString(playlist.description),
        user: playlist.userId,
        pictureUrl: playlist.coverImgUrl,
        songs,
        tags: ['全部', ...playlist.tags],
        updateTime: format(
          new Date(playlist.updateTime),
          'yyyy-MM-dd HH:mm:ss'
        ),
        createTime: format(
          new Date(playlist.createTime),
          'yyyy-MM-dd HH:mm:ss'
        ),
      })
    }

    offset += limit
    if (offset < size) {
      await step(offset, Math.min(100, size - offset), size)
    }
  })(0, Math.min(size, 100), size)

  console.log('歌单总数量：', playlistMap.size)
  console.log('处理歌单---end----')
  return playlistMap
}

/**
 * 获取所有歌曲
 * @param playlistMap
 */
async function getSongMap(playlistMap) {
  console.log('处理歌曲---begin----')
  const songMap = new Map()
  let nu = 0

  for (const playlist of playlistMap.values()) {
    const id = playlist.id
    console.log(
      '----正在处理歌单的歌曲[',
      ++nu,
      '/',
      playlistMap.size,
      ']：',
      id
    )
    const result = await playlist_track_all({ id })
    const songs = result.body.songs

    if (songs === null || songs === undefined) continue

    songs
      .filter((song) => song.copyright === 1)
      .forEach((song) => {
        if (songMap.has(song.id)) return

        songMap.set(song.id, {
          uuid: v4(),
          id: song.id,
          name: escapeString(song.name),
          pictureUrl: song.al.picUrl,
          url: song.id,
          album: song.al.id,
          artists: song.ar.map((ar) => ar.id),
          publishTime: format(
            new Date(song.publishTime),
            'yyyy-MM-dd HH:mm:ss'
          ),
          status: '0',
        })
      })
  }
  console.log('歌曲总数量：', songMap.size)
  console.log('处理歌曲---end----')
  return songMap
}

/**
 * 解析所有歌手
 */
async function getArtistMap(songMap) {
  console.log('处理歌手---begin----')
  const artistMap = new Map()
  let nu = 0

  for (const song of songMap.values()) {
    for (const id of song.artists) {
      if (id === 0) continue
      artistMap.set(id, {})
    }
  }
  for (const id of artistMap.keys()) {
    console.log('----正在处理歌手[', ++nu, '/', artistMap.size, ']：', id)

    if (artistMap.get(id) === {}) continue

    try {
      const result = await artist_detail({ id })
      const detail = result.body.data.artist
      let userDetail = result.body.data.user
      if (userDetail === undefined || userDetail === null) {
        userDetail = {
          nickname: '',
          avatarUrl: '',
        }
      }
      artistMap.set(id, {
        uuid: v4(),
        id: id,
        name: escapeString(detail.name),
        pictureUrl: detail.cover,
        description: escapeString(detail.briefDesc),
        type: 0,
        user: v4(),
        area: 0,
        status: 0,
        userDetail: {
          nickname: userDetail.nickname,
          avatarUrl: userDetail.avatarUrl,
        },
      })
    } catch (e) {
      console.error(e)
      artistMap.set(id, {
        uuid: v4(),
        id: id,
        name: '该歌手已注销',
        pictureUrl: '',
        description: '',
        type: 0,
        user: v4(),
        area: 0,
        status: 1,
        userDetail: {
          nickname: '',
          avatarUrl: '',
        },
      })
    }
  }
  console.log('歌手总数量：', artistMap.size)
  console.log('处理歌手---end----')
  return artistMap
}

/**
 * 解析所有用户
 * @param artistMap
 * @param playlistMap
 */
async function getUserMap(artistMap, playlistMap) {
  console.log('处理用户---begin----')
  const userMap = new Map()

  for (const artist of artistMap.values()) {
    const id = artist.id

    const user = artist.userDetail
    userMap.set(id, {
      uuid: artist.user,
      id: id,
      username: randomString(),
      password: randomString(),
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      loginTime: 0,
      role: 0,
      status: 0,
    })
  }

  for (const playlist of playlistMap.values()) {
    const id = playlist.user
    if (userMap.has(id)) continue

    const result = await user_detail({ uid: id })
    const user = result.body.profile

    userMap.set(id, {
      uuid: v4(),
      id: id,
      username: randomString(),
      password: randomString(),
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      loginTime: 0,
      role: 0,
      status: 0,
    })
  }
  console.log('用户数量：', userMap.size)
  console.log('处理用户---end----')
  return userMap
}

async function getLyricMap(songMap) {
  console.log('处理歌词---begin----')
  let nu = 0
  const lyricMap = new Map()
  for (const song of songMap.values()) {
    const id = song.id
    console.log('----正在处理歌词[', ++nu, '/', songMap.size, ']：', id)

    const result = await lyric({ id })
    const content = escapeString(result.body.lrc.lyric)

    if (content === '' || content === null || content === undefined) continue

    lyricMap.set(song.uuid, {
      content,
      song: song.uuid,
    })
  }
  console.log('歌词总数量：', lyricMap.size)
  console.log('处理歌词---end----')
  return lyricMap
}

/**
 * 获取专辑
 */
async function getAlbumMap(artistMap, songMap) {
  console.log('处理专辑---begin----')
  const albumMap = new Map()
  let nu = 0

  for (const song of songMap.values()) {
    albumMap.set(song.album, {})
  }
  for (const id of albumMap.keys()) {
    console.log('----正在处理专辑[', ++nu, '/', albumMap.size, ']：', id)

    if (albumMap.get(id) === {}) continue
    try {
      const result = await album({ id })
      const detail = result.body.album

      albumMap.set(id, {
        uuid: v4(),
        name: escapeString(detail.name),
        description: escapeString(detail.description),
        artists: detail.artists
          .map((artist) => artist.id)
          .filter((artistId) => artistMap.has(artistId)),
        pictureUrl: detail.picUrl,
        publishTime: format(
          new Date(detail.publishTime),
          'yyyy-MM-dd HH:mm:ss'
        ),
        createTime: format(new Date(detail.publishTime), 'yyyy-MM-dd HH:mm:ss'),
        status: 0,
      })
    } catch (e) {
      console.error(e)
      albumMap.set(id, {
        uuid: v4(),
        name: '未知专辑',
        description: '',
        artists: [],
        pictureUrl: '',
        publishTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        createTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        status: 0,
      })
    }
  }
  console.log('专辑总数量：', albumMap.size)
  console.log('处理专辑---end----')
  return albumMap
}

/**
 * 生成Sql文件
 * 生成 Insert 语句
 * @returns {Promise<void>}
 */
async function generateSqlFile(filename = 'data.sql') {
  const appendSqlFunc = (title, map, firstSql, callback) => {
    console.log('生成', title, 'SQL语句', '--------', 'begin', '-------')
    fs.appendFileSync(filename, `insert into ${firstSql} \n values`)
    let array = [...map.values()]
    for (let index = 0; index < array.length; ++index) {
      const value = array[index]
      fs.appendFileSync(filename, `\n(${callback(value)})`)
      if (index !== array.length - 1) {
        fs.appendFileSync(filename, ',')
      }
    }
    fs.appendFileSync(filename, ';\n')
    console.log('生成', title, 'SQL语句', '--------', 'end', '-------')
  }

  const playlistTagMap = await getPlaylistTagMap()
  const playlistMap = await getPlaylistMap(1000, '华语')
  const songMap = await getSongMap(playlistMap)
  const artistMap = await getArtistMap(songMap)
  const albumMap = await getAlbumMap(artistMap, songMap)
  const userMap = await getUserMap(artistMap, playlistMap)
  const lyricMap = await getLyricMap(songMap)

  // 创建文件, 存在则清空
  fs.writeFileSync(filename, '', { flag: 'w' })

  // 生成 标签
  appendSqlFunc('标签', playlistTagMap, 'playlist_tag(name)', (value) => {
    return `'${value}'`
  })

  // 生成 用户
  appendSqlFunc(
    '用户',
    userMap,
    `user(uuid, username, password, nickname, avatar_url,  login_time, role, status)`,
    (value) => {
      return `'${value.uuid}', '${value.username}', '${value.password}', '${value.nickname}' ,'${value.avatarUrl}', now(), '${value.role}', '${value.status}'`
    }
  )

  // 生成 歌手
  appendSqlFunc(
    '歌手',
    artistMap,
    `artist(uuid, user, name, description, picture_url, type, area, status)`,
    (value) => {
      const description =
        value.description == null ? null : `'${value.description}'`
      return `'${value.uuid}', '${value.user}', '${value.name}', ${description}, '${value.pictureUrl}', '${value.type}', '${value.area}', '${value.status}'`
    }
  )

  // 生成歌单
  appendSqlFunc(
    '歌单',
    playlistMap,
    `playlist(uuid, name, description, picture_url, user, songs, tags, update_time, create_time)`,
    (value) => {
      const user = userMap.get(value.user).uuid
      const description = value.description
      const songs = value.songs
        .map((songId) => `"${songMap.get(songId).uuid}"`)
        .toLocaleString()
      const tags = value.tags.map((tag) => `"${tag}"`).toLocaleString()

      return `'${value.uuid}', '${value.name}', '${description}', '${value.pictureUrl}',  '${user}', '[${songs}]', '[${tags}]', '${value.updateTime}', '${value.updateTime}'`
    }
  )

  // 生成专辑
  appendSqlFunc(
    '专辑',
    albumMap,
    `album(uuid, name, description, artists, picture_url,publish_time, create_time, status)`,
    (value) => {
      const artists = value.artists
        .map((artistId) => `"${artistMap.get(artistId).uuid}"`)
        .toLocaleString()

      const description =
        value.description == null ? null : `'${value.description}'`
      return `'${value.uuid}', '${value.name}', ${description}, '[${artists}]', '${value.pictureUrl}', '${value.publishTime}', '${value.createTime}','${value.status}'`
    }
  )

  // 生成歌曲
  appendSqlFunc(
    '歌曲',
    songMap,
    `song(uuid, name, picture_url, artists, album, url, status)`,
    (value) => {
      const artists = value.artists
        .filter((id) => id !== 0)
        .map((artistId) => `"${artistMap.get(artistId).uuid}"`)
        .toLocaleString()

      const album = albumMap.get(value.album).uuid

      return `'${value.uuid}', '${value.name}', '${value.pictureUrl}', '[${artists}]', '${album}','${value.url}', '${value.status}'`
    }
  )

  // 生成歌词
  appendSqlFunc('歌词', lyricMap, `lyric(song, content)`, (value) => {
    return `'${value.song}', '${value.content}'`
  })

  console.log(`
    ~~~~~生成SQL文件成功~~~~~~
    文件位置: ${filename}
    歌单标签数量: ${playlistTagMap.size}
    歌单数量: ${playlistMap.size}
    歌手数量: ${artistMap.size}
    歌曲数量: ${songMap.size}
    专辑数量: ${albumMap.size}
    用户数量: ${userMap.size}
  `)
}

await (async function () {
  await generateSqlFile()
})()
