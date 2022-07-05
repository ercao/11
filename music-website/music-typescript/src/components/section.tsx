import React from 'react'
import { useQuery } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { Box } from '@mui/material'
import { CoverRow, CoverRowItemType, CoverRowProps, RowHeader } from 'src/components/cover'
import { AlbumType, ArtistType, PlaylistType, SongType } from 'src/types/entity'
import { PlaylistTypography, Typography } from './typorgraphy'

type CommonRecommendSectionProps = Omit<CoverRowProps, 'items'> & {
  title: string
  endpoint: string
  size: number
  dataHandler: (data: unknown) => CoverRowItemType[]
}

const CommonRecommendSection = ({ endpoint, size, dataHandler, title, ...props }: CommonRecommendSectionProps) => {
  // 获取推荐 items
  const { data } = useQuery(
    [`${endpoint}s`, 'random', size],
    async ({ queryKey }) => await ajax(`${queryKey[0]}/${queryKey[1]}`, { data: { size } })
  )

  if (!data) return <></>

  return (
    <div style={{ flex: '1 1 0' }}>
      <RowHeader title={title} />
      <CoverRow endpoint={endpoint} items={dataHandler(data.data)} {...props} />
    </div>
  )
}

export const AlbumSection = () => {
  return (
    <CommonRecommendSection
      title='推荐专辑'
      endpoint='album'
      size={3}
      sx={{}}
      column={3}
      dataHandler={(albums) =>
        (albums as AlbumType[]).map((album) => ({
          id: album.uuid,
          url: album.pictureUrl,
          content: (
            <>
              <Typography width='12rem' fontWeight='bold' title={album.name}>
                {album.name}
              </Typography>
              <Typography width='12rem' color='gray'>
                by{' '}
                {album?.artistList?.map((artist) => (
                  <span key={artist.uuid}>{artist.name}</span>
                ))}
              </Typography>
            </>
          ),
        }))
      }
    />
  )
}

export const PlaylistSection = () => {
  return (
    <CommonRecommendSection
      title='推荐歌单'
      endpoint='playlist'
      size={10}
      column={5}
      dataHandler={(playlists) =>
        (playlists as PlaylistType[]).map((playlist) => ({
          id: playlist.uuid,
          url: playlist.pictureUrl,
          content: <PlaylistTypography name={playlist.name} user={playlist.userEntity.nickname} />,
        }))
      }
    />
  )
}

export const ArtistSection = () => {
  return (
    <CommonRecommendSection
      title='推荐艺人'
      endpoint='artist'
      size={6}
      column={6}
      sx={{ borderRadius: '50%' }}
      dataHandler={(artists) =>
        (artists as ArtistType[]).map((artist) => ({
          id: artist.uuid,
          url: artist.pictureUrl,
          content: (
            <Typography width='12rem' textAlign='center' fontWeight='bold' title={artist.name}>
              {artist.name}
            </Typography>
          ),
        }))
      }
    />
  )
}

export const ForYouSection = () => {
  const { isFetching, data } = useQuery(
    ['songs', 'random'],
    async () => await ajax<SongType[]>('songs/random', { data: { size: 1 } })
  )

  if (isFetching) return <></>

  const song = (data?.data as SongType[])[0]

  return (
    <div style={{ flex: '1 1 0' }}>
      <RowHeader title='FOR YOU' />

      <Box
        sx={{
          backgroundImage: `url(${song.pictureUrl})`,
          width: '100%',
          aspectRatio: '3 / 1.1',
          backgroundSize: 'cover',
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            whiteSpace: 'normal',
          }}
          fontSize='4rem'
          width='11rem'
          padding='1rem'
          color='white'
          fontWeight='bold'
        >
          每日推荐
        </Typography>
      </Box>
    </div>
  )
}
