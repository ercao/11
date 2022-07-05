import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { AlbumType, ArtistType, SongType } from 'src/types/entity'
import { Cover, CoverRow, RowHeader } from 'src/components/cover'
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { DescriptionTypography } from 'src/components/typorgraphy'

const ArtistPage = () => {
  const {
    query: { id },
  } = useRouter()
  const { data: artistResult } = useQuery(
    ['artist', id],
    async () => await ajax<ArtistType>(`artist`, { data: { id } }),
    {
      enabled: Boolean(id),
    }
  )

  const { data: albumsResult } = useQuery(
    ['artist', 'albums', id],
    async () => await ajax<AlbumType[]>(`artist/albums`, { data: { id } }),
    {
      enabled: Boolean(id),
    }
  )
  const { data: songsResult } = useQuery(
    ['artist', 'songs', id],
    async () => await ajax<SongType[]>(`artist/songs`, { data: { id } }),
    {
      enabled: Boolean(id),
    }
  )
  const artist = artistResult?.data
  const songs = songsResult?.data
  const albums = albumsResult?.data
  if (!artist || !songs || !albums) return <></>

  return (
    <>
      <Stack py={5} direction='row' spacing={2}>
        <Cover
          id={artist.uuid}
          url={artist.pictureUrl}
          height='15rem'
          width='15rem'
          borderRadius='50%'
          boxShadow={2}
          endpoint='artist'
        />

        <Box sx={{ display: 'grid', py: '1rem' }}>
          <RowHeader title={artist.name} />
          <Typography>
            共有{songs.length}首歌，共发行{albums.length}个专辑
          </Typography>

          <DescriptionTypography text={artist.description} />
        </Box>
      </Stack>

      {/* 歌曲列表 */}
      <RowHeader title='歌曲' />
      <Grid gridAutoColumns={6} container>
        {songs.map((song) => (
          <Grid
            xs={2}
            item
            key={song.uuid}
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              height: '5rem',
            }}
          >
            <Avatar
              sx={{
                height: '4rem',
                width: '4rem',
                mx: '1rem',
              }}
              src={song.pictureUrl}
            />
            <Typography>{song.name}</Typography>
          </Grid>
        ))}
      </Grid>

      {/* 专辑列表 */}
      <RowHeader title='专辑' />
      <CoverRow
        column={6}
        items={albums.map((album) => ({
          id: album.uuid,
          url: album.pictureUrl,
          content: <Typography fontWeight='bold'>{album.name}</Typography>,
        }))}
        endpoint='album'
      />
    </>
  )
}

export default ArtistPage
