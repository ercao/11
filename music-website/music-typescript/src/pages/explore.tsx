import React from 'react'
import { useQuery } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { useRouter } from 'next/router'
import { Link } from 'src/components/link'
import { PageType, PlaylistTagType, PlaylistType } from 'src/types/entity'
import { CoverRow, RowHeader } from 'src/components/cover'
import { PlaylistTypography, Typography } from 'src/components/typorgraphy'
import { ButtonBase, Stack } from '@mui/material'

const ExplorePage = () => {
  const { query } = useRouter()
  const tag = query.tag ? query.tag : '全部'
  const size = query.size ? parseInt(query.size as string) : 100

  const { data: tagsResult } = useQuery(
    ['playlists', 'tags'],
    async () => await ajax<PlaylistTagType[]>('playlists/tags', {})
  )

  const { data: pageResult } = useQuery(
    ['playlists', tag, size],
    async () =>
      await ajax<PageType<PlaylistType[]>>('playlists', {
        data: { tag, size },
      })
  )
  const playlists = pageResult?.data?.data
  const tags = tagsResult?.data
  if (!playlists || !tags) return <></>

  return (
    <>
      <RowHeader title='发现' fontSize={40} />
      <Stack spacing={2} direction='row' py={2}>
        {[{ name: '全部' }, ...tags].slice(0, 10).map((item) => (
          <ButtonBase
            sx={{
              cursor: 'pointer',
              borderRadius: 2,
              '&:hover': {},
              background: tag === item.name ? '#eaeffd' : '#f5f5f7',
            }}
            color={tag === item.name ? 'primary' : 'inherit'}
            key={item.name}
            component={Link}
            href={{ pathname: '/explore', query: { tag: item.name } }}
          >
            <Typography fontWeight='bold' fontSize={18} px={2} py={1} color={tag === item.name ? 'primary' : '#7a7a7b'}>
              {item.name}
            </Typography>
          </ButtonBase>
        ))}
      </Stack>
      <div className='grid grid-cols-6 gap-10'>
        {playlists.length < 1 ? (
          <span>该分类暂无歌单</span>
        ) : (
          <CoverRow
            items={playlists.map((playlist) => ({
              id: playlist.uuid,
              url: playlist.pictureUrl,
              content: <PlaylistTypography name={playlist.name} user={playlist.userEntity.nickname} />,
            }))}
            endpoint='playlist'
          />
        )}
      </div>
    </>
  )
}

export default ExplorePage
