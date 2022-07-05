import React, { useState } from 'react'
import { useUser } from 'src/utils/hook'
import { useRouter } from 'next/router'
import { CoverRow, RowHeader } from 'src/components/cover'
import { useQuery } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { PlaylistType } from 'src/types/entity'
import { useEffectOnce } from 'react-use'
import { PlaylistTypography, Typography } from 'src/components/typorgraphy'
import { CreatePlaylistButton } from 'src/components/button'
import { Divider } from '@mui/material'

const UserPage = () => {
  const { user, token } = useUser()
  const { push } = useRouter()
  const [open, setOpen] = useState(false)

  useEffectOnce(() => {
    if (!user) {
      push('/login').then()
    }
  })

  const { data } = useQuery(
    ['user', 'playlists', user?.uuid],
    async () =>
      await ajax<PlaylistType[]>('user/playlists', {
        data: { id: user?.uuid },
        token,
      }),
    {
      enabled: Boolean(user),
    }
  )
  if (!user) return <></>
  const playlists = data?.data

  return (
    <>
      {/*  我的歌单 */}
      <RowHeader title='我的歌单' />
      <CreatePlaylistButton>添加歌单</CreatePlaylistButton>
      <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

      {/* 歌单列表 */}
      {playlists && playlists.length > 0 ? (
        <CoverRow
          column={5}
          items={playlists.map((playlist) => ({
            id: playlist.uuid,
            url: playlist.pictureUrl,
            content: <PlaylistTypography name={playlist.name} user={playlist.userEntity.nickname} />,
          }))}
          endpoint='playlist'
        />
      ) : (
        <Typography>暂无歌单</Typography>
      )}
    </>
  )
}

export default UserPage
