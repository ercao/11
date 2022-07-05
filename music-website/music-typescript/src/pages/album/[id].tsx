import { Box, Button, Stack, Typography } from '@mui/material'
import { Cover } from 'src/components/cover'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { AlbumType, SongType } from 'src/types/entity'
import { MusicList } from 'src/components/music-list'
import { DescriptionTypography } from 'src/components/typorgraphy'
import { CollectionButton } from 'src/components/button'
import { format } from 'date-fns'

const AlbumPage = () => {
  const {
    query: { id },
  } = useRouter()
  const { data: albumResult } = useQuery(['album', id], async () => await ajax<AlbumType>(`album`, { data: { id } }), {
    enabled: Boolean(id),
  })
  const { data: songsResult } = useQuery(
    ['album', 'songs', id],
    async () => await ajax<SongType[]>(`album/songs`, { data: { id } }),
    {
      enabled: Boolean(id),
    }
  )

  const album = albumResult?.data
  const songs = songsResult?.data
  if (!album || !songs) return <></>

  console.log(album)

  return (
    <>
      <Stack py={5} direction='row' spacing={2}>
        <Cover
          id={album.uuid}
          url={album.pictureUrl}
          sx={{ width: '20rem', height: '20rem', boxShadow: 2 }}
          endpoint='album'
        />

        <Box sx={{ display: 'grid', py: '1rem' }}>
          <Typography fontWeight='bold'>{album.name}</Typography>
          <Typography>
            By {album.artistList.reduce((prev, cur) => `${prev} ${cur.name}`, '')}
            <br />
            发行时间： {format(new Date(album.publishTime), 'yyyy-MM-dd')}
            <br />
            共有{songs.length}首歌
          </Typography>

          <DescriptionTypography text={album.description} />
          <Box>
            <Button variant='outlined'>播放</Button>
            <CollectionButton songs={songs.map((song) => song.uuid)} />
          </Box>
        </Box>
      </Stack>

      <MusicList items={songs} />
    </>
  )
}

export default AlbumPage
